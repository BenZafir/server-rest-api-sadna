01. Init node project: npm init -y
02. Install dependencies: npm install express lowdb morgan nanoid yamljs swagger-ui-express cors
03. Install dev dependencies: npm install -D typescript ts-node nodemon @types/cors @types/express @types/lowdb @types/morgan @types/yamljs @types/swagger-ui-express
04. Init typescript project: npx tsc --init
05. Configure tsconfig.json: rootDir pointing ./src and outDir pointing ./build and comment code line with "module": "commonjs" and uncomment "moduleResolution": "node",.
06. Validate tsconfig.json running: npx tsc
07. Create the scaffold.
08. Configure comands in package.json:
    "build": "tsc",
    "dev": "nodemon",
    "start": "node build/index.js",
09. For deploy:
    npm run build
    npm start

IMPORTANT!
* lowdb works perfectly at 1.0.0 version and @types/lowdb@1.0.9
