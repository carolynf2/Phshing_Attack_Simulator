// Phishing Detective Agency - Game Logic

class PhishingDetectiveGame {
    constructor() {
        this.gameState = {
            rank: 'ROOKIE',
            casesSolved: 0,
            reputation: 0,
            badges: [],
            currentCase: null,
            selectedResolution: null
        };
        
        this.loadGameState();
        this.initializeGame();
    }

    initializeGame() {
        this.updateUI();
        this.initializeBadges();
        this.initializeCases();
    }

    // Save and Load System
    saveGameState() {
        localStorage.setItem('phishingDetectiveGame', JSON.stringify(this.gameState));
    }

    loadGameState() {
        const saved = localStorage.getItem('phishingDetectiveGame');
        if (saved) {
            this.gameState = { ...this.gameState, ...JSON.parse(saved) };
        }
    }

    // UI Management
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    updateUI() {
        document.getElementById('rank').textContent = this.gameState.rank;
        document.getElementById('cases-solved').textContent = this.gameState.casesSolved;
        document.getElementById('reputation').textContent = this.gameState.reputation;
    }

    // Badge System
    initializeBadges() {
        this.badges = [
            {
                id: 'first-case',
                name: 'First Case',
                description: 'Solve your first phishing case',
                condition: () => this.gameState.casesSolved >= 1,
                icon: '🕵️'
            },
            {
                id: 'email-expert',
                name: 'Email Expert',
                description: 'Correctly identify 5 phishing emails',
                condition: () => this.gameState.casesSolved >= 5,
                icon: '📧'
            },
            {
                id: 'interview-master',
                name: 'Interview Master',
                description: 'Complete 3 witness interviews',
                condition: () => this.gameState.reputation >= 150,
                icon: '🎤'
            },
            {
                id: 'cyber-sleuth',
                name: 'Cyber Sleuth',
                description: 'Reach Detective rank',
                condition: () => this.gameState.reputation >= 200,
                icon: '💻'
            },
            {
                id: 'security-expert',
                name: 'Security Expert',
                description: 'Solve 10 cases',
                condition: () => this.gameState.casesSolved >= 10,
                icon: '🔒'
            }
        ];
        this.checkBadges();
    }

    checkBadges() {
        this.badges.forEach(badge => {
            if (badge.condition() && !this.gameState.badges.includes(badge.id)) {
                this.gameState.badges.push(badge.id);
                this.showBadgeEarned(badge);
            }
        });
        this.updateRank();
        this.saveGameState();
    }

    updateRank() {
        const reputation = this.gameState.reputation;
        if (reputation >= 500) this.gameState.rank = 'CHIEF DETECTIVE';
        else if (reputation >= 300) this.gameState.rank = 'SENIOR DETECTIVE';
        else if (reputation >= 200) this.gameState.rank = 'DETECTIVE';
        else if (reputation >= 100) this.gameState.rank = 'INVESTIGATOR';
        else this.gameState.rank = 'ROOKIE';
    }

    showBadgeEarned(badge) {
        alert(`🎉 Badge Earned: ${badge.icon} ${badge.name}\n${badge.description}`);
    }

    displayBadges() {
        const badgesGrid = document.getElementById('badges-grid');
        badgesGrid.innerHTML = '';
        
        this.badges.forEach(badge => {
            const badgeElement = document.createElement('div');
            badgeElement.className = `badge ${this.gameState.badges.includes(badge.id) ? 'earned' : ''}`;
            badgeElement.innerHTML = `
                <h4>${badge.icon} ${badge.name}</h4>
                <p>${badge.description}</p>
                ${this.gameState.badges.includes(badge.id) ? '<p style="color: #00ff00;">✓ EARNED</p>' : '<p style="color: #666;">LOCKED</p>'}
            `;
            badgesGrid.appendChild(badgeElement);
        });
    }

    // Case System
    initializeCases() {
        this.cases = [
            {
                id: 1,
                title: 'The Urgent Account Verification',
                description: 'A company employee received an urgent email about account verification.',
                difficulty: 'easy',
                email: {
                    from: 'security-alert@bankng.com',
                    to: 'john.doe@company.com',
                    subject: 'URGENT: Verify Your Account Immediately',
                    date: 'Today 09:15 AM',
                    body: `Dear Valued Customer,

Your account has been flagged for suspicious activity. To prevent account closure, you must verify your identity immediately.

Click here to verify: http://bankng-security.net/verify-now

If you do not respond within 24 hours, your account will be permanently closed.

Regards,
Bank Security Team

CONFIDENTIAL: This email contains sensitive information.`
                },
                witnesses: [
                    {
                        name: 'John Doe',
                        role: 'Account Holder',
                        dialogue: 'I got this email this morning. It seemed urgent, so I almost clicked the link. Something felt off though.',
                        questions: [
                            { text: 'What made you suspicious?', response: 'The sender address looked similar but not exactly right. Also, my bank usually calls for urgent matters.' },
                            { text: 'Have you seen similar emails?', response: 'Yes, I get these every few months. Usually delete them, but this one was more convincing.' },
                            { text: 'Did you click the link?', response: 'No, I decided to call the bank first. Good thing too - they said it was fake.' }
                        ]
                    },
                    {
                        name: 'Sarah Wilson',
                        role: 'IT Security',
                        dialogue: 'We\'ve been seeing an increase in these banking phishing attempts. The domains are getting more sophisticated.',
                        questions: [
                            { text: 'What are the red flags?', response: 'Domain spoofing is the biggest one. They use similar domains like bankng.com instead of banking.com.' },
                            { text: 'How common are these?', response: 'We block about 50 of these per day. They\'re getting more frequent and sophisticated.' }
                        ]
                    }
                ],
                analysis: {
                    sender: 'Domain analysis reveals this is not the official bank domain. The legitimate domain is "banking.com" not "bankng.com".',
                    links: 'The verification link redirects to a malicious website designed to steal credentials.',
                    language: 'Uses urgent, threatening language typical of phishing attempts. Legitimate banks don\'t threaten immediate account closure.',
                    attachments: 'No attachments detected in this email.'
                },
                correctAnswer: 'phishing',
                resolution: {
                    phishing: {
                        title: 'Phishing Confirmed',
                        description: 'Excellent detective work! This is indeed a phishing email attempting to steal banking credentials.',
                        explanation: 'Key indicators: domain spoofing (bankng.com vs banking.com), urgent threatening language, and suspicious verification link.',
                        reputation: 50
                    },
                    legitimate: {
                        title: 'Incorrect Assessment',
                        description: 'This email is actually a phishing attempt, not legitimate.',
                        explanation: 'The domain spoofing and urgent language are clear indicators of phishing.',
                        reputation: 10
                    },
                    spam: {
                        title: 'Partially Correct',
                        description: 'While this is unwanted email, it\'s specifically a phishing attempt.',
                        explanation: 'Phishing is a more specific and dangerous category than general spam.',
                        reputation: 25
                    }
                }
            },
            {
                id: 2,
                title: 'The Lottery Winner Scam',
                description: 'An employee received notification of winning a lottery they never entered.',
                difficulty: 'medium',
                email: {
                    from: 'international.lottery@winner-notification.org',
                    to: 'mary.smith@company.com',
                    subject: 'Congratulations! You\'ve Won $2,500,000',
                    date: 'Yesterday 11:30 AM',
                    body: `CONGRATULATIONS!!!

You have been selected as a winner in the International Email Lottery Program.

Prize Amount: $2,500,000 USD
Ticket Number: IEL-7749-2024
Batch Number: 24/899/IEL

To claim your prize, please contact our claims department with the following information:
- Full Name
- Address
- Phone Number
- Date of Birth
- Bank Account Details

Contact: Mr. James Wilson
Email: claims.dept@winner-notification.org
Phone: +44-703-598-7749

This offer expires in 72 hours.

International Lottery Commission`
                },
                witnesses: [
                    {
                        name: 'Mary Smith',
                        role: 'Office Manager',
                        dialogue: 'I never entered any lottery, but the email looks official. They want my bank details to transfer the money.',
                        questions: [
                            { text: 'Did you enter any lottery?', response: 'No, never. I don\'t gamble or enter contests online.' },
                            { text: 'What information did they request?', response: 'They want everything - name, address, phone, birth date, and bank account details.' },
                            { text: 'Does anything seem suspicious?', response: 'Well, winning something I never entered is weird. Also, why do they need my bank details?' }
                        ]
                    }
                ],
                analysis: {
                    sender: 'The domain "winner-notification.org" is not associated with any legitimate lottery organization.',
                    links: 'No suspicious links detected, but the contact information leads to unverified sources.',
                    language: 'Uses excitement and urgency tactics. Legitimate lotteries don\'t randomly select email winners.',
                    attachments: 'No attachments in this email.'
                },
                correctAnswer: 'phishing',
                resolution: {
                    phishing: {
                        title: 'Phishing Scam Identified',
                        description: 'Correct! This is a classic advance fee/lottery scam designed to steal personal and financial information.',
                        explanation: 'Key indicators: unsolicited lottery win, request for bank details, unverified contact information.',
                        reputation: 60
                    },
                    legitimate: {
                        title: 'Dangerous Misidentification',
                        description: 'This is a dangerous scam that could lead to financial theft.',
                        explanation: 'Legitimate lotteries don\'t randomly email winners or request bank account details.',
                        reputation: 5
                    },
                    spam: {
                        title: 'Partially Correct',
                        description: 'While this is spam, it\'s specifically a dangerous phishing scam.',
                        explanation: 'This type of scam can lead to identity theft and financial loss.',
                        reputation: 30
                    }
                }
            },
            {
                id: 3,
                title: 'The IT Support Impersonation',
                description: 'Someone claiming to be from IT support is requesting remote access credentials.',
                difficulty: 'hard',
                email: {
                    from: 'it-support@company-tech.net',
                    to: 'employees@company.com',
                    subject: 'Mandatory Security Update - Action Required',
                    date: 'Today 2:30 PM',
                    body: `IT Department Notice

All employees must install a critical security update by end of day.

Due to recent security threats, we need to update all workstations remotely.

Please download and run the security update tool:
https://company-tech.net/security-update/installer.exe

If you experience any issues, provide your login credentials to our support team for remote assistance.

Credentials needed:
- Username
- Password  
- VPN Access Code

For immediate support, contact:
📞 Support Line: 555-TECH (8324)
📧 Email: urgent-support@company-tech.net

IT Security Team
Company Technology Services`
                },
                witnesses: [
                    {
                        name: 'Tom Rodriguez',
                        role: 'Real IT Manager',
                        dialogue: 'We never sent this email. Our domain is company.com, not company-tech.net. This is definitely not from our team.',
                        questions: [
                            { text: 'Is this from your department?', response: 'Absolutely not. We would never ask for passwords via email, and our domain is different.' },
                            { text: 'How do you handle updates?', response: 'We push updates through our centralized management system. Employees never need to download executables.' },
                            { text: 'What should employees do?', response: 'Delete the email immediately and report it. Never provide credentials to anyone claiming to be IT via email.' }
                        ]
                    },
                    {
                        name: 'Lisa Chen',
                        role: 'Employee',
                        dialogue: 'I almost downloaded the file. It looked official and I wanted to stay compliant with IT policies.',
                        questions: [
                            { text: 'What made it seem official?', response: 'The formatting looked professional, and they used our company name. The urgency made me want to act quickly.' },
                            { text: 'Did you download anything?', response: 'No, I decided to check with IT first. Lucky I did!' }
                        ]
                    }
                ],
                analysis: {
                    sender: 'Domain spoofing detected. The real company domain is "company.com" not "company-tech.net".',
                    links: 'The download link leads to a potentially malicious executable file that could install malware.',
                    language: 'Uses authority and urgency to pressure immediate action. Requests sensitive credentials.',
                    attachments: 'No direct attachments, but provides download links to executable files.'
                },
                correctAnswer: 'phishing',
                resolution: {
                    phishing: {
                        title: 'Sophisticated Phishing Attack',
                        description: 'Excellent work! This is a sophisticated phishing attack impersonating IT support.',
                        explanation: 'Key indicators: domain spoofing, executable download links, credential harvesting attempt, and IT confirmed they didn\'t send it.',
                        reputation: 80
                    },
                    legitimate: {
                        title: 'Critical Error',
                        description: 'This is a dangerous phishing attack that could compromise the entire network.',
                        explanation: 'IT departments never ask for passwords via email or distribute updates through random downloads.',
                        reputation: 0
                    },
                    spam: {
                        title: 'Inadequate Assessment',
                        description: 'This is far more dangerous than simple spam - it\'s a targeted phishing attack.',
                        explanation: 'This type of attack could lead to network compromise and data breaches.',
                        reputation: 20
                    }
                }
            }
        ];
    }

    displayCases() {
        const casesList = document.getElementById('cases-list');
        casesList.innerHTML = '';
        
        this.cases.forEach(caseItem => {
            const caseElement = document.createElement('div');
            caseElement.className = `case-item ${caseItem.difficulty}`;
            caseElement.onclick = () => this.startCase(caseItem.id);
            
            caseElement.innerHTML = `
                <span class="difficulty">${caseItem.difficulty.toUpperCase()}</span>
                <h4>Case #${String(caseItem.id).padStart(3, '0')}: ${caseItem.title}</h4>
                <p>${caseItem.description}</p>
            `;
            casesList.appendChild(caseElement);
        });
    }

    // Case Investigation
    startCase(caseId) {
        this.gameState.currentCase = this.cases.find(c => c.id === caseId);
        this.displayCase();
        this.showScreen('case-investigation');
    }

    displayCase() {
        const currentCase = this.gameState.currentCase;
        
        document.getElementById('case-title').textContent = `CASE #${String(currentCase.id).padStart(3, '0')}: ${currentCase.title}`;
        document.getElementById('case-description').textContent = currentCase.description;
        
        // Display email
        document.getElementById('email-from').textContent = currentCase.email.from;
        document.getElementById('email-to').textContent = currentCase.email.to;
        document.getElementById('email-subject').textContent = currentCase.email.subject;
        document.getElementById('email-date').textContent = currentCase.email.date;
        document.getElementById('email-body').textContent = currentCase.email.body;
        
        // Display witnesses
        this.displayWitnesses();
        
        // Setup resolution options
        this.setupResolutionOptions();
        
        // Clear previous analysis
        document.getElementById('analysis-results').innerHTML = '';
        document.getElementById('interview-dialogue').classList.add('hidden');
        this.gameState.selectedResolution = null;
        document.getElementById('submit-case').disabled = true;
    }

    displayWitnesses() {
        const witnessesList = document.getElementById('witnesses-list');
        witnessesList.innerHTML = '';
        
        this.gameState.currentCase.witnesses.forEach((witness, index) => {
            const witnessElement = document.createElement('div');
            witnessElement.className = 'witness-card';
            witnessElement.onclick = () => this.startInterview(index);
            
            witnessElement.innerHTML = `
                <h4>${witness.name}</h4>
                <p>${witness.role}</p>
                <p>Click to interview</p>
            `;
            witnessesList.appendChild(witnessElement);
        });
    }

    setupResolutionOptions() {
        const resolutionOptions = document.getElementById('resolution-options');
        resolutionOptions.innerHTML = '';
        
        const options = [
            { id: 'phishing', title: 'Phishing Attack', description: 'This is a malicious attempt to steal sensitive information' },
            { id: 'legitimate', title: 'Legitimate Email', description: 'This appears to be a genuine communication' },
            { id: 'spam', title: 'Spam Email', description: 'This is unwanted bulk email but not necessarily malicious' }
        ];
        
        options.forEach(option => {
            const optionElement = document.createElement('div');
            optionElement.className = 'resolution-option';
            optionElement.onclick = () => this.selectResolution(option.id, optionElement);
            
            optionElement.innerHTML = `
                <h4>${option.title}</h4>
                <p>${option.description}</p>
            `;
            resolutionOptions.appendChild(optionElement);
        });
    }

    selectResolution(resolutionId, element) {
        // Remove previous selection
        document.querySelectorAll('.resolution-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        
        // Add selection to clicked element
        element.classList.add('selected');
        this.gameState.selectedResolution = resolutionId;
        document.getElementById('submit-case').disabled = false;
    }

    // Email Analysis
    analyzeEmail(analysisType) {
        const results = document.getElementById('analysis-results');
        const analysis = this.gameState.currentCase.analysis[analysisType];
        
        results.innerHTML = `
            <h4>Analysis: ${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}</h4>
            <p>${analysis}</p>
        `;
    }

    // Witness Interview System
    startInterview(witnessIndex) {
        const witness = this.gameState.currentCase.witnesses[witnessIndex];
        const dialogueDiv = document.getElementById('interview-dialogue');
        
        document.getElementById('witness-name').textContent = `${witness.name} (${witness.role})`;
        document.getElementById('witness-dialogue').textContent = witness.dialogue;
        
        this.displayInterviewOptions(witness);
        dialogueDiv.classList.remove('hidden');
    }

    displayInterviewOptions(witness) {
        const optionsDiv = document.getElementById('interview-options');
        optionsDiv.innerHTML = '';
        
        witness.questions.forEach((question, index) => {
            const button = document.createElement('button');
            button.className = 'interview-option';
            button.textContent = question.text;
            button.onclick = () => this.askQuestion(question, button);
            optionsDiv.appendChild(button);
        });
        
        // Add back button
        const backButton = document.createElement('button');
        backButton.className = 'interview-option';
        backButton.textContent = '← Back to witness list';
        backButton.onclick = () => document.getElementById('interview-dialogue').classList.add('hidden');
        optionsDiv.appendChild(backButton);
    }

    askQuestion(question, button) {
        document.getElementById('witness-dialogue').textContent = question.response;
        button.disabled = true;
        button.style.opacity = '0.5';
    }

    // Case Resolution
    submitCase() {
        if (!this.gameState.selectedResolution) return;
        
        const resolution = this.gameState.currentCase.resolution[this.gameState.selectedResolution];
        const isCorrect = this.gameState.selectedResolution === this.gameState.currentCase.correctAnswer;
        
        // Update game state
        this.gameState.casesSolved++;
        this.gameState.reputation += resolution.reputation;
        
        // Display result
        this.displayCaseResult(resolution, isCorrect);
        this.showScreen('case-result');
        
        // Check for new badges and save
        this.checkBadges();
        this.updateUI();
    }

    displayCaseResult(resolution, isCorrect) {
        const resultTitle = document.getElementById('result-title');
        const resultContent = document.getElementById('result-content');
        const rewards = document.getElementById('rewards');
        
        resultTitle.textContent = isCorrect ? 'CASE CLOSED - SUCCESS!' : 'CASE CLOSED - REVIEW NEEDED';
        
        resultContent.className = `result-content ${isCorrect ? 'success' : 'failure'}`;
        resultContent.innerHTML = `
            <h3>${resolution.title}</h3>
            <p><strong>Assessment:</strong> ${resolution.description}</p>
            <p><strong>Explanation:</strong> ${resolution.explanation}</p>
        `;
        
        rewards.innerHTML = `
            <div class="reward-item">
                +${resolution.reputation} Reputation
            </div>
            <div class="reward-item">
                Cases Solved: ${this.gameState.casesSolved}
            </div>
        `;
    }
}

// Global Game Instance
let game;

// Global Functions (called by HTML)
function startGame() {
    game.displayCases();
    game.showScreen('case-selection');
}

function showMainMenu() {
    game.showScreen('main-menu');
    game.updateUI();
}

function showBadges() {
    game.displayBadges();
    game.showScreen('badges');
}

function showInstructions() {
    game.showScreen('instructions');
}

function showCaseSelection() {
    game.displayCases();
    game.showScreen('case-selection');
}

function analyzeEmail(type) {
    game.analyzeEmail(type);
}

function submitCase() {
    game.submitCase();
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', function() {
    game = new PhishingDetectiveGame();
});