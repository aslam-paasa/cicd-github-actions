/**
 * CI/CD:
 * > CI/CD ek process hai jo tumhare code automatically:
 *   - Test karta hai
 *   - Build karta hai
 *   - Deploy karta hai (production pe)
 * > Har baar jab tum code 'git push' karte ho GitHub pe:
 *   - System code pull karta hai
 *   - Tests run karta hau (sab sahi chal rha?)
 *   - Build prepare karta hau (production-ready code)
 *   - Agar sab pass ho gya automatically server pe deploy kar deta hai
 *   - Agar fail ho gya, error report bhej deta hai
 * > Result:
 *   - Fast deployment
 *   - No manual work
 *   - No downtime
 *   - Safer updates
 * 
 *                                 +--->[Fail]
 *                                 |
 *   [code base]--->[test cases]---+
 *                                 |
 *                                 +--->[Pass]--->[main]--->[user]
 *                                             |
 *                                             V
 *                                         Auto-deploy
 * 
 * Note: This time we will use services, not raw deployment.
*/


/**
 * Continuous Integration (CI): Testing
 * > Integration ka matlab - new code to existing code ke saath merge
 *   karna.
 * > Continuous Integration ka goal:
 *   - Har baar jab developer code push kare, system automatically test
 *     kare ki code sahi kaam kar rha hai ya nahi.
 * > CI Steps:
 *   1. Developer pushes code
 *   2. System Automatically
 *      - Code ko pull karta hai
 *      - Test cases run karta hai
 *      - Linting/formatting check karta hai
 *   3. Agar sab pass, next stage (deployment)
 *   4. Agar fail, developer ko message milta hau 'fix your code!'
*/

/**
 * Continuous Deployment (CD): 
 * > Deployment ka matlab - code ko production (live users) tak
 *   pahuchana.
 * > Continuous Deployment ka goal:
 *   - Tests pass hone ke baad code automatically deploy ho jaye 
 *     server pe.
 * > CD Steps:
 *   1. CI ke tests pass hue
 *   2. Code automatically deploy ho jata hai
 *   3. PM2 restart karta hai app (without downtime)
 *   4. Nginx serve karta hai new version users ko
 * 
 * > Benefit:
 *   - No manual uploads
 *   - Always latest version live
 *   - No downtime, no interruption for users
*/

/** 
 * Example Flow (Code to Deployment)
 *
 * Developer   →   GitHub   →   CI/CD Pipeline   →   Server
 *   |               |               |                 |
 *   |  git push     |               |                 |
 *   |-------------->|  triggers     |                 |
 *                   |-------------->|  test + build   |
 *                                   |---------------->|  deploy + restart
 *                                                     ↓
 *                                               Users see new version 
*/

/**
 * What is GitHub Action?
 * > GitHub Action ek automation system hai jo tumhare code ke liye
 *   'tasks' automatically chala sakta hau jab bhi koi event hota hai,
 *   jaise ki:
 *   - Jab hum 'git push' karte hai
 *   - Jab koi branch merge hota hai
 *   - Jab koi PR (pull request) open hota hai
 * > Basically:
 *   GitHub Action = Robot ko humare code ko saath kaam krta hai
 *                   automatically.
*/

/**
 * Where do we write GitHub Action?
 * > Tumhare apne GitHub repo ke andar ek special folder banana hota h
 * > .github/ 
 *    └── workflows/ 
 *        └── deploy.yml  [Yeh humara action file hoga]
 * 
 * > "deploy.yml" file me likha gaya code batata hai ki:
 *   - Kab (when) action chale
 *   - Kya (what) steps run karo
 *   - Kaunse environment me (where)
*/

/**
 * What is a YAML file?
 * > YAML ek simple file format hoti hai jisme indentation (spaces) 
 *   matter karta hai.
 * > Ye config likhne ke liye use hota hai (like JSON but cleaner).
 * 
 * > Rules:
 *   - Colon (:) ke baad space dena zaroori hai
 *   - Tabs mat use karo, sirf spaces use karo
 *   - '-' means ek item in list
 *   - Capitalization zaruri nahi hoti, but indentation 100% correct
 *     hona chahiye.
 * 
 * > Example:
 *   name: My Workflow
 * 
 *   on:
 *     push:
 *       branches:
 *         - main
 * 
 * > Meaning: Jab bhi koi push karega "main" branch pe, ye workflow
 *            chalega.
*/

/**
 * Goal:
 * > Hum chahte hai:
 *   Jab bhi hum code push karein 'main' branch pe:
 *   1. Node.js setup ho
 *   2. Dependencies install ho (npm install)
 *   3. Tests run ho (npm test)
 *   4. Agar sab pass ho, deploy ho humare server pe using SSH.
*/

/**
 * deploy.yml: Automatic Build, Test & Deploy
 * > GitHub Actions ke liye ek instruction manual jisse GitHub ko pta
 *   chalta hai ki humare code ke saath kya krna hai.
 * 
 *    name: Deploy Node.js App
 * 
 * 1. WHEN TO RUN THIS WORKFLOW
 *    on:
 *      push:
 *        branches:
 *          - main        # Jab bhi main branch pe push hoga, ye chalega
 * 
 * 2. JOBS — steps jo run honge
 *    jobs:
 *      build-and-deploy:
 *        runs-on: ubuntu-latest            # GitHub server (Ubuntu Linux) jaha ye steps chalenge
 *    
 *        steps:
 *          # a. Checkout (pull repo code)
 *          - name: Checkout Code
 *            uses: actions/checkout@v3     # Ye GitHub repo ka latest code khinchta hai
 *    
 *          # b. Node.js environment setup
 *          - name: Setup Node.js
 *            uses: actions/setup-node@v3
 *            with:
 *              node-version: '18'          # Node.js environment banata hai (Ubuntu pe)
 *    
 *          # c. Dependencies install
 *          - name: Install Dependencies
 *            run: npm install              # node_modules install karta hai
 *    
 *          # d. Run tests
 *          - name: Run Tests
 *            run: npm test                 # Tumhare test cases run karta hai    
 *    
 *          # e. Deploy to your server
 *          - name: Deploy to Production
 *            if: success()                 # Sirf tab chalega agar tests pass ho jayein
 *            run: |
 *              echo "Connecting to server and deploying..."
 *              ssh -o StrictHostKeyChecking=no ubuntu@your-server-ip "
 *                cd /var/www/myapp &&
 *                git pull origin main &&
 *                npm install &&
 *                pm2 restart all
 *              "
 * 
 * Explanation:
 * 1. name: "Deploy Node.js App"
 *    > Ye workflow ka naam hai
 *    > Ye GitHub Actions dashboard me dikhai dega
 * 
 * 2. on: push -> branches: main
 *    > Ye batata hau kab ye file chalegi
 *    > Jab bhi tum code main branch pe push karoge, ye action
 *      automatically start hoga.
 *    > Example:
 *      - git add .
 *      - git commit -m "new update"
 *      - git push origin main (it auto-trigger deploy.yml)
 * 
 * 3. jobs:
 *    > Ye workflow ke andar "job" hota hai (yani task group).
 *    > Ek job ke andar set of tasks hota hai jo step by step run
 *      hote hai.
 *    > yahan ek hi job hai: build-and-deploy
 *      (ye code build, test, and deploy sab karta hai)
 * 
 * 4. runs-on: ubuntu-latest
 *    > GitHub ke paas apne servers hote hai jahan ye steps run krte h
 *    > Humne bola "Ubuntu latest use karo" - matlab Linux env milega.
 * 
 * 
 * Let's break - 
 * > name: Deploy to Production
 *   a. App folder me jata hai         (cd /var/www/myapp)
 *   b. Latest code pull karta hai     (git pull origin main)
 *   c. Dependencies install karta hai (npm install)
 *   d. PM2 se app restart karta hai   (without downtime)
 * > So, after this step, users instantly see your latest code.
*/

/**
 * Secure Deployment (Secrets):
 * > Tumhe apna password ya private key directly file me nahi likhna 
 *   chahiye 
 * 
 * Use GitHub Secrets:
 * > Go to your repo → Settings → Secrets → Actions:
 * > Add:
 *     SERVER_IP = 1.2.3.4
 *     SERVER_USER = ubuntu
 *     SSH_PRIVATE_KEY = (paste your private SSH key)
 * 
 * > Then use these in YAML file:
 *     - name: Deploy to Server
 *       env:
 *         SERVER_IP: ${{ secrets.SERVER_IP }}
 *         SERVER_USER: ${{ secrets.SERVER_USER }}
 *         SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
 *       run: |
 *         echo "$SSH_PRIVATE_KEY" > key.pem
 *         chmod 600 key.pem
 *         ssh -i key.pem $SERVER_USER@$SERVER_IP "
 *           cd /var/www/myapp &&
 *           git pull origin main &&
 *           npm install &&
 *           pm2 restart all
 *         "
 *     
 * 
 * > Secrets = safe environment variables jo sirf GitHub ke andar secure
 *             rehte hain 
*/ 


/**
 * Final Result (Full Automated Flow):
 * > Developer pushes new code - 'git push origin main'
 * > GitHub Action automatically:
 *   - Runs npm install
 *   - Runs tests
 *   - SSH se server me login karta hai
 *   - Latest code pull karta hai
 *   - PM2 se app restart karta hai (no downtime)
 *   - Nginx already serving HTTPS - so users see updated secure app
 * 
 * > In short:
 *   Push Code > Auto Test > Auto Deploy > App live on HTTPS
*/

/**
 * Summary:
 * > GitHub Actions     = Automation System in GitHub
 * > .github/workflows/ = Folder where action files are stored
 * > YAML               = Config file format for defining actions
 * > Steps              = Commands that run automatically
 * > Secrets            = Store credentials safely (like SSH key)
 * 
 * What it achieves:
 * > Fully automated testing & deployment
 * > No manual SSH or uploads
 * > Fast & Safe delivery to users
*/

/**
 * Installation:
 * > npm i express
 * > npm i --save-dev jest supertest
*/

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/chai', (req, res) => {
    res.send('Hello World Chai');
});

app.get('crash', (req, res) => {
    res.send('App is crashing...');
    process.exit(1);
});

/* take params from url and returns a response */
app.get('/:id', (req, res) => {
    res.send(`hello world ${req.params.id}`)
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
});

module.exports = app;