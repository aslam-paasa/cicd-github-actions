/**
 * CICD without Pipeline:
*/

/**
 * Push it on GitHub:
 * > git init
 * > git add .
 * > git commit -m "test"
 * > git branch -M main  
 * > git remote add origin https://github.com/aslam-paasa/cicd-github-actions.git
 * > git push -u origin main
*/

/**
 * Deploy it on render:
 * > Click on:
 *   - Add New 
 *   - Web Service
 *   - Github-project: cicd-github-actions
 *     > Root Directory - app
 *     > Start Command  - npm run dev
 * > Deploy on Render
 * > Your backend is now LIVE.
 * 
 * Note: Update code > Push to GitHub > Auto-deploy on Render
 *       That's okay for learning, but not okay for real companies.
*/

/**
 * The Problem (why CI/CD exists):
 * > Imagine this situation:
 *   - You write new code
 *   - Test FAIL
 *   - But code still deploys
 *   - Users see bugs
 * > So companies say:
 *   "Deploy only if tests pass"
 * > This idea is called Continuous Integration (CI).
*/


/**
 * Continuous Integration (CI): Testing
 * > Integration ka matlab - new code to existing code ke saath merge
 *   karna.
 * > Continuous Integration ka goal:
 *   - Har baar jab developer code push kare, system automatically test
 *     kare ki code sahi kaam kar rha hai ya nahi.
 * > Now, instead of direct deployment, we will create pipelines:
 *   a. If test fail: No deployment
 *   b. If test pass: Build + Deploy
 *    And this automatic checking is done by CI Tools like Jenkins or
 *    GitHub Actions.
 * 
 * > Flow: 
 * 
 *                                 +--->[Fail]
 *                                 |
 *   [code base]--->[test cases]---+
 *                                 |
 *                                 +--->[Pass]--->[main]--->[user]
 *                                             |
 *                                             V
 *                                         Auto-deploy
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
 * Connecting GitHub Actions with Render:
 * > To create pipeline, we will use tools like GitHub Action:
 *   - We can see 'Actions' Button on top of our Project in GitHub.
 *   - To run test cases we have many actions
 *   - It will create .github folder in our project repo
 *   - Inside .github folder, we have workflow and inside that workflow
 *     we have .yml file that has the actions.
 *   - But ye sab pipelines kaise lagaya jae:
 * 
 * > Hum chahte hai ki deployment tabhi ho jab test cases successfully
 *   pass ho, and for that our first step is to, go to settings of 
 *   render, we can see two things:
 *   1. Auto-Deploy:
 *      > Stop auto-deploy on every commit
 *      > Change 'On-Commit' to 'After CI Checks Pass'
 *      > Meaning: "Render, wait for GitHub Actions result"
 *   2. Deploy Hook? 
 *      > Deploy Hook = Secret Door
 *      > It's a private URL
 *      > When someone hits this URL, Render deploys
 *        (Only trusted systems should know this.)
 *      > So, we store it in GitHub Secrets:
 *        a. Go to Project Repo > Settings
 *        b. Secrets and Variables > Actions
 *        c. Click New Repository Secret
 *        d. Add:
 *           - Name: RENDER_DEPLOY_HOOK
 *           - Secret: https://api.render.com/deploy/srv-d52p0t95pdvs73el4sjg?key=Nhn8zOjJyiE
 *           - Now GitHub Actions can access it safely
 *   
 *                                   +--->[Fail]
 *                                   |
 *     [code base]--->[test cases]---+
 *                                   |
 *                                   +--->[Pass]--->[main]--->[user]
 *                                               |
 *                                               V
 *                                    Call Render Deploy Hook
*/

/**
 * Writing Pipeline Script: test-and-deploy.yml 
 * 
 * 1. What is .github/workflows/test-and-deploy.yml?
 *    > .github/workflows/ ek special folder hai jaha GitHub Actions
 *      ke rules likhe jaate hai
 *    > Simple language mein: "Automation ka instruction manual"
 * 
 * 2. test-and-deploy.yml
 *    > Ye configuration file hai jisme hum GitHub ko bolte hai:
 *      - Kb run karna hai
 *      - Kya run karna hai
 *      - Kis order me run karna hai
 *    
 *    a. Workflow ka naam
 *       > name: Test and Deploy
 *       > Ye sirf workflow ka display name hai
 *       > GitHub Actions tab me dikhega
 *       > Sirf readability ke liye
 * 
 *    b. Workflow kab chalega?
 *       > on:
 *           push:
 *             branches:
 *               - main
 *       > Iska matlab:
 *         - Jab bhi main branch pe push karega
 *         - Ye workflow automatically start ho jayega.
 * 
 *    c. Jobs - Kaam ka breakdown
 *       > jobs:
 *           test:
 *           deploy:
 *       > Hum 2 jobs chala rhe hai:
 *         1. test   - Pehle tests
 *         2. deploy - tests pass hone ke baad deploy
 * 
 *    d. Job-1: test (sabse important)
 *       1. test:
 *           runs-on: ubuntu-latest
 *           defaults:
 *             run:
 *               working-directory: ./app
 *   
 *       1.a. Kis machine pe chale?
 *            > runs-on: ubuntu-latest
 *            > GitHub ek temporary Linux Machine deta hai
 *            > Name: ubuntu-latest - Isi machine pe testing hoti hai
 *              (Iske liye GitHub charge karti hai)
 * 
 *       1.b. working-directory: ./app 
 *            > defaults:
 *                run:
 *                  working-directory: ./app
 *            > Tera Node app ./app folder me hai, isliye commands iske
 *              andr run honge:
 *              - npm install
 *              - npm test
 *            > Agar ye nhi likhte, commands root folder me chalti
 * 
 *       2. steps: Ab testing k liye kon se steps perform karna chahte h
 *          > Humein Machine mili, ab uss machine pe kya krna hai? 
 *       
 *           steps:
 *             - name: Checkout code
 *               uses: actions/checkout@v4
 *       
 *             - name: Setup Node.js
 *               uses: actions/setup-node@v4
 *               with:
 *                 node-version: 18
 *       
 *             - name: Install dependencies
 *               run: npm install
 *       
 *             - name: Run tests
 *               run: npm test
 * 
 *          2.a. Code download karo:
 *               - name: Checkout code
 *                 uses: actions/checkout@v4
 *               - GitHub ki machine empty hoti hai
 *               - Iss step me: tera github repo ka code uss machine pe
 *                 copy hota hai
 *               - Without this, kuch nhi run nahi hoga
 *          2.b. Node.js install karo
 *               - name: Setup Node.js
 *                 uses: actions/setup-node@v4
 *                 with:
 *                   node-version: 18
 *               - Machine me by default Node nahi hota
 *               - Ye step: Har node.js v18 install karta hai
 *               - GitHub ye action ready-made deta hai
 *               - Hum bas use kar rhe hai
 *          2.c. Dependencies install
 *               - name: Install dependencies
 *                 uses: npm install
 *               - package.json se saare packages install honge
 *               - Exactly waise hi jaise tu local machine pe karta hai
 *          2.d. Test run karo
 *               - name: Run tests
 *                 uses: npm test
 *               - Ye line decide karti hai deploy hoga ya nahi
 *               - Agar: test fail > job fail > aage kuch nhi
 *                       test pass > job success > deploy job allowed
 * 
 *    e. Job-2: deploy
 * 
 *        deploy:
 *          needs: test
 *          runs-on: ubuntu-latest
 *   
 *          steps:
 *            - name: Deploy to Render
 *              run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
 * 
 *       1. deploy:  
 *            needs: test
 *          - Iska matlab:
 *            deploy tabhi chalega jab test job successfully pass ho
 *    
 *       2. Machine:
 *          > runs-on: ubuntu-latest
 *          > Deploy ke liye bhi ek fresh machine milti hai
 *    
 *       3. if: success() then only trigger render deploy hook
 *    
 *       4. Deploy ka actual step
 *          - name: Deploy to Render
 *          - run: curl -X POST ${{ secrets.RENDER_DEPLOY_HOOK }}
 *          - Simple words me:
 *            - Render ne tujhe webhook url diya
 *            - Wo URL bolta hai: "Isko hit karo, deploy start"
 *            - curl -X POST: Ek HTTP request bhej rha hai
 *            - ${{ secrets.RENDER_DEPLOY_HOOK }}:
 *              - Ye secret value hai
 *              - GitHub me safely stored hoti hai
 *              - Code me expose nahi hoti (security)   
 * 
*/

/** 
 * Example Flow of CICD:
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
 * Installation:
 * > npm i express
 * > npm i --save-dev jest supertest
*/

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

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

/* Only listen if not in test */
if (require.main === module) {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  }

module.exports = app;
