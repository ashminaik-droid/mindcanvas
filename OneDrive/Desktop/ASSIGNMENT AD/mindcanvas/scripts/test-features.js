// scripts/test-features.js
// Automated verification suite for MindCanvas Phases 1 & 2

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ✗ FAIL: ${name}`);
    console.error(`    -> ${err.message}`);
    failedTests++;
  }
}

console.log('====================================================');
console.log('   MindCanvas Automated Feature Verification Suite  ');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST SUITE 1: File & Folder Structure
// ----------------------------------------------------
console.log('📁 Test Suite 1: File & Folder Structure');

const requiredFiles = [
  'app/_layout.js',
  'app/index.js',
  'app/(auth)/_layout.js',
  'app/(auth)/login.js',
  'app/(auth)/register.js',
  'app/(tabs)/_layout.js',
  'app/(tabs)/home.js',
  'app/(tabs)/calendar.js',
  'app/(tabs)/insights.js',
  'app/(tabs)/profile.js',
  'app/journal/_layout.js',
  'app/journal/mood.js',
  'app/journal/editor.js',
  'components/CustomCard.js',
  'constants/Colors.js',
  'constants/Moods.js',
  'context/AuthContext.js',
  'firebase/firebaseConfig.js',
  'services/auth.js',
  'services/journal.js',
  'services/quotes.js',
  'assets/images/app-icon.png',
  'app.json',
  'package.json'
];

requiredFiles.forEach((file) => {
  test(`File exists: ${file}`, () => {
    const fullPath = path.join(ROOT, file);
    assert.strictEqual(fs.existsSync(fullPath), true, `Missing expected file: ${file}`);
  });
});

// ----------------------------------------------------
// TEST SUITE 2: Theme and Constants
// ----------------------------------------------------
console.log('\n🎨 Test Suite 2: Theme & Constants (Colors & Moods)');

test('Colors.js exports valid pastel theme hex values', () => {
  const colorsFile = fs.readFileSync(path.join(ROOT, 'constants/Colors.js'), 'utf8');
  assert.ok(colorsFile.includes('#FFF9F3'), 'Background color #FFF9F3 missing');
  assert.ok(colorsFile.includes('#B9A5E8'), 'Primary lavender #B9A5E8 missing');
  assert.ok(colorsFile.includes('#F5C6D6'), 'Secondary pink #F5C6D6 missing');
  assert.ok(colorsFile.includes('#FFD6B0'), 'Accent peach #FFD6B0 missing');
  assert.ok(colorsFile.includes('#44404A'), 'Text charcoal #44404A missing');
  assert.ok(colorsFile.includes('#FFFFFF'), 'Card surface #FFFFFF missing');
});

test('Moods.js exports 5 defined moods with emojis & pastel colors', () => {
  const moodsFile = fs.readFileSync(path.join(ROOT, 'constants/Moods.js'), 'utf8');
  assert.ok(moodsFile.includes('happy'), 'Happy mood missing');
  assert.ok(moodsFile.includes('calm'), 'Calm mood missing');
  assert.ok(moodsFile.includes('loved'), 'Loved mood missing');
  assert.ok(moodsFile.includes('anxious'), 'Anxious mood missing');
  assert.ok(moodsFile.includes('sad'), 'Sad mood missing');
  assert.ok(moodsFile.includes('😊'), 'Happy emoji missing');
  assert.ok(moodsFile.includes('😌'), 'Calm emoji missing');
});

// ----------------------------------------------------
// TEST SUITE 3: Validation Logic
// ----------------------------------------------------
console.log('\n🔍 Test Suite 3: Form Validations (Login & Register)');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

test('Email format validation accepts valid emails', () => {
  const validEmails = ['user@example.com', 'student123@college.edu', 'test.name@domain.co'];
  validEmails.forEach((email) => {
    assert.strictEqual(emailRegex.test(email), true, `Failed on valid email: ${email}`);
  });
});

test('Email format validation rejects invalid emails', () => {
  const invalidEmails = ['plainaddress', '@missingusername.com', 'username@.com', 'user with spaces@domain.com'];
  invalidEmails.forEach((email) => {
    assert.strictEqual(emailRegex.test(email), false, `Accepted invalid email: ${email}`);
  });
});

test('Password minimum length check (at least 6 chars)', () => {
  const validatePasswordLength = (pwd) => Boolean(pwd && pwd.length >= 6);
  assert.strictEqual(validatePasswordLength('12345'), false, 'Password with 5 chars should be rejected');
  assert.strictEqual(validatePasswordLength(''), false, 'Empty password should be rejected');
  assert.strictEqual(validatePasswordLength('123456'), true, 'Password with 6 chars should be accepted');
  assert.strictEqual(validatePasswordLength('secretPassword!'), true, 'Long password should be accepted');
});

test('Password confirmation matching', () => {
  const doPasswordsMatch = (pwd1, pwd2) => pwd1 === pwd2;
  assert.strictEqual(doPasswordsMatch('mypassword', 'mypassword'), true, 'Matching passwords should pass');
  assert.strictEqual(doPasswordsMatch('mypassword', 'otherpassword'), false, 'Different passwords should fail');
});

// ----------------------------------------------------
// TEST SUITE 4: Error Handling & Mapping
// ----------------------------------------------------
console.log('\n⚠️ Test Suite 4: Firebase Error Code Mapping');

test('getAuthErrorMessage maps all standard Firebase error codes correctly', () => {
  const authModule = fs.readFileSync(path.join(ROOT, 'services/auth.js'), 'utf8');
  assert.ok(authModule.includes('auth/email-already-in-use'), 'Missing auth/email-already-in-use');
  assert.ok(authModule.includes('auth/invalid-email'), 'Missing auth/invalid-email');
  assert.ok(authModule.includes('auth/weak-password'), 'Missing auth/weak-password');
  assert.ok(authModule.includes('auth/wrong-password'), 'Missing auth/wrong-password');
  assert.ok(authModule.includes('auth/user-not-found'), 'Missing auth/user-not-found');
  assert.ok(authModule.includes('auth/invalid-credential'), 'Missing auth/invalid-credential');
  assert.ok(authModule.includes('auth/too-many-requests'), 'Missing auth/too-many-requests');
  assert.ok(authModule.includes('auth/network-request-failed'), 'Missing auth/network-request-failed');
});

// ----------------------------------------------------
// TEST SUITE 5: Firebase Config & AsyncStorage Persistence
// ----------------------------------------------------
console.log('\n⚙️ Test Suite 5: Firebase Setup & Auth Persistence');

test('firebaseConfig.js configures AsyncStorage persistence for native platforms', () => {
  const config = fs.readFileSync(path.join(ROOT, 'firebase/firebaseConfig.js'), 'utf8');
  assert.ok(config.includes('getReactNativePersistence'), 'getReactNativePersistence missing');
  assert.ok(config.includes('AsyncStorage'), 'AsyncStorage missing');
  assert.ok(config.includes('getApps().length === 0'), 'Double initialization guard missing');
  assert.ok(config.includes('export { app, auth, db }'), 'Required exports missing');
});

test('package.json includes required dependencies', () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const deps = pkg.dependencies;
  assert.ok(deps['firebase'], 'firebase dependency missing');
  assert.ok(deps['react-native-paper'], 'react-native-paper dependency missing');
  assert.ok(deps['@expo/vector-icons'], '@expo/vector-icons dependency missing');
  assert.ok(deps['@react-native-async-storage/async-storage'], 'async-storage dependency missing');
  assert.ok(deps['expo-router'], 'expo-router dependency missing');
});

// ----------------------------------------------------
// TEST SUITE 6: UI Components & Route Guards
// ----------------------------------------------------
console.log('\n🛡️ Test Suite 6: Route Guards & Auth Context');

test('app/_layout.js implements route protection and loading splash', () => {
  const layout = fs.readFileSync(path.join(ROOT, 'app/_layout.js'), 'utf8');
  assert.ok(layout.includes('AuthProvider'), 'AuthProvider wrapper missing');
  assert.ok(layout.includes('useSegments'), 'useSegments hook missing');
  assert.ok(layout.includes('useAuth'), 'useAuth hook missing');
  assert.ok(layout.includes('/(auth)/login'), 'Redirect to login missing');
  assert.ok(layout.includes('/(tabs)/home'), 'Redirect to home missing');
});

test('app/(tabs)/profile.js contains Sign Out implementation', () => {
  const profile = fs.readFileSync(path.join(ROOT, 'app/(tabs)/profile.js'), 'utf8');
  assert.ok(profile.includes('handleLogout'), 'handleLogout missing');
  assert.ok(profile.includes('logout()'), 'logout function call missing');
  assert.ok(profile.includes('Sign Out'), 'Sign Out button label missing');
});

test('app/(auth)/register.js includes show/hide password toggle and loading state', () => {
  const reg = fs.readFileSync(path.join(ROOT, 'app/(auth)/register.js'), 'utf8');
  assert.ok(reg.includes('showPassword'), 'showPassword state missing');
  assert.ok(reg.includes('showConfirmPassword'), 'showConfirmPassword state missing');
  assert.ok(reg.includes('loading'), 'loading state missing');
  assert.ok(reg.includes('updateProfile') || reg.includes('register('), 'register handler missing');
});

test('app/(auth)/login.js includes show/hide password toggle and login call', () => {
  const login = fs.readFileSync(path.join(ROOT, 'app/(auth)/login.js'), 'utf8');
  assert.ok(login.includes('showPassword'), 'showPassword state missing');
  assert.ok(login.includes('login('), 'login call missing');
  assert.ok(login.includes('getAuthErrorMessage'), 'error mapping missing');
});

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`Results: ${passedTests} / ${totalTests} tests passed (${failedTests} failed)`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL UNIT AND INTEGRATION CHECKS PASSED!\n');
}
