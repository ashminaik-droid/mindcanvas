// scripts/test-features.js
// Automated verification suite for MindCanvas Phases 1 to 6
// Testing Project Structure, Auth, UI, Firestore, ZenQuotes, Assets & Polish

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
console.log('   MindCanvas Automated Comprehensive Test Suite    ');
console.log('   Testing Phases 1 – 6 (Final Polish & Submission)  ');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST SUITE 1: Project Structure Integrity
// ----------------------------------------------------
console.log('📁 Test Suite 1: Project Structure Integrity');

const coreFiles = [
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
  'app/favourites.js',
  'components/CustomCard.js',
  'components/CustomButton.js',
  'components/MoodCard.js',
  'components/JournalCard.js',
  'components/QuoteCard.js',
  'constants/Colors.js',
  'constants/Moods.js',
  'context/AuthContext.js',
  'firebase/firebaseConfig.js',
  'services/auth.js',
  'services/journal.js',
  'services/quotes.js',
  'assets/images/app-icon.png',
  'assets/images/splash-icon.png',
  'assets/images/android-icon-foreground.png',
  'app.json',
  'package.json'
];

coreFiles.forEach((file) => {
  test(`File integrity check: ${file}`, () => {
    const fullPath = path.join(ROOT, file);
    assert.strictEqual(fs.existsSync(fullPath), true, `Missing expected file: ${file}`);
  });
});

// ----------------------------------------------------
// TEST SUITE 2: Pastel Theme & Mood Constants
// ----------------------------------------------------
console.log('\n🎨 Test Suite 2: Pastel Theme & Mood Constants');

test('Colors.js contains all required pastel theme tokens', () => {
  const colorsFile = fs.readFileSync(path.join(ROOT, 'constants/Colors.js'), 'utf8');
  assert.ok(colorsFile.includes('#FFF9F3'), 'Background color #FFF9F3 missing');
  assert.ok(colorsFile.includes('#B9A5E8'), 'Primary lavender #B9A5E8 missing');
  assert.ok(colorsFile.includes('#F5C6D6'), 'Secondary pink #F5C6D6 missing');
  assert.ok(colorsFile.includes('#FFD6B0'), 'Accent peach #FFD6B0 missing');
  assert.ok(colorsFile.includes('#44404A'), 'Text charcoal #44404A missing');
  assert.ok(colorsFile.includes('#FFFFFF'), 'Card surface #FFFFFF missing');
});

test('Moods.js contains all 5 required moods and pastel colors', () => {
  const moodsFile = fs.readFileSync(path.join(ROOT, 'constants/Moods.js'), 'utf8');
  assert.ok(moodsFile.includes('happy') && moodsFile.includes('#FFF3B0'), 'Happy yellow missing');
  assert.ok(moodsFile.includes('calm') && moodsFile.includes('#E2D4F0'), 'Calm lavender missing');
  assert.ok(moodsFile.includes('loved') && moodsFile.includes('#F5C6D6'), 'Loved pink missing');
  assert.ok(moodsFile.includes('anxious') && moodsFile.includes('#FFD6B0'), 'Anxious peach missing');
  assert.ok(moodsFile.includes('sad') && moodsFile.includes('#C5D3E8'), 'Sad light blue missing');
});

// ----------------------------------------------------
// TEST SUITE 3: Firebase Auth & Session Management
// ----------------------------------------------------
console.log('\n🔐 Test Suite 3: Firebase Auth & Session Management');

test('firebase/firebaseConfig.js initializes Firebase App & Auth with AsyncStorage', () => {
  const cfg = fs.readFileSync(path.join(ROOT, 'firebase/firebaseConfig.js'), 'utf8');
  assert.ok(cfg.includes('initializeApp'), 'initializeApp missing');
  assert.ok(cfg.includes('initializeAuth') || cfg.includes('getAuth'), 'Auth initialization missing');
  assert.ok(cfg.includes('getFirestore'), 'Firestore initialization missing');
});

test('services/auth.js exports registration, login, logout, and listener', () => {
  const authService = fs.readFileSync(path.join(ROOT, 'services/auth.js'), 'utf8');
  assert.ok(authService.includes('export const registerUser'), 'registerUser missing');
  assert.ok(authService.includes('export const loginUser'), 'loginUser missing');
  assert.ok(authService.includes('export const logoutUser'), 'logoutUser missing');
  assert.ok(authService.includes('export const subscribeToAuthChanges'), 'subscribeToAuthChanges missing');
  assert.ok(authService.includes('export const getAuthErrorMessage'), 'getAuthErrorMessage missing');
});

// ----------------------------------------------------
// TEST SUITE 4: Cloud Firestore Journal Operations
// ----------------------------------------------------
console.log('\n📖 Test Suite 4: Cloud Firestore Journal Service');

test('services/journal.js implements full CRUD operations', () => {
  const journalService = fs.readFileSync(path.join(ROOT, 'services/journal.js'), 'utf8');
  assert.ok(journalService.includes('export const createEntry'), 'createEntry missing');
  assert.ok(journalService.includes('export const getEntries'), 'getEntries missing');
  assert.ok(journalService.includes('export const updateEntry'), 'updateEntry missing');
  assert.ok(journalService.includes('export const deleteEntry'), 'deleteEntry missing');
  assert.ok(journalService.includes('export const subscribeToEntries'), 'subscribeToEntries missing');
  assert.ok(journalService.includes('users') && journalService.includes('entries'), 'Subcollection path missing');
});

// ----------------------------------------------------
// TEST SUITE 5: ZenQuotes API Service & Favourites
// ----------------------------------------------------
console.log('\n💬 Test Suite 5: ZenQuotes API & Favourites Service');

test('services/quotes.js points to ZenQuotes API endpoints with CORS proxy fallback', () => {
  const service = fs.readFileSync(path.join(ROOT, 'services/quotes.js'), 'utf8');
  assert.ok(service.includes('https://zenquotes.io/api/today'), 'Today endpoint missing');
  assert.ok(service.includes('https://zenquotes.io/api/random'), 'Random endpoint missing');
  assert.ok(service.includes('allorigins'), 'CORS web fallback missing');
});

test('services/quotes.js implements Firestore favourite quotes functions', () => {
  const service = fs.readFileSync(path.join(ROOT, 'services/quotes.js'), 'utf8');
  assert.ok(service.includes('export const addFavouriteQuote'), 'addFavouriteQuote missing');
  assert.ok(service.includes('export const removeFavouriteQuote'), 'removeFavouriteQuote missing');
  assert.ok(service.includes('export const getFavouriteQuotes'), 'getFavouriteQuotes missing');
  assert.ok(service.includes('export const subscribeToFavouriteQuotes'), 'subscribeToFavouriteQuotes missing');
  assert.ok(service.includes('favouriteQuotes'), 'favouriteQuotes collection missing');
});

// ----------------------------------------------------
// TEST SUITE 6: QuoteCard & Favourites UI
// ----------------------------------------------------
console.log('\n🧩 Test Suite 6: Interactive Components & Favourites');

test('QuoteCard.js supports refresh, favorite toggle, loading and retry', () => {
  const card = fs.readFileSync(path.join(ROOT, 'components/QuoteCard.js'), 'utf8');
  assert.ok(card.includes('onRefresh'), 'onRefresh prop missing');
  assert.ok(card.includes('onToggleFavorite'), 'onToggleFavorite prop missing');
  assert.ok(card.includes('isFavorite'), 'isFavorite prop missing');
  assert.ok(card.includes('onRetry'), 'onRetry prop missing');
  assert.ok(card.includes('refresh-outline'), 'Refresh icon missing');
  assert.ok(card.includes('heart'), 'Heart icon missing');
});

test('app/favourites.js connects to subscribeToFavouriteQuotes and provides removal', () => {
  const favScreen = fs.readFileSync(path.join(ROOT, 'app/favourites.js'), 'utf8');
  assert.ok(favScreen.includes('subscribeToFavouriteQuotes'), 'subscribeToFavouriteQuotes missing');
  assert.ok(favScreen.includes('removeFavouriteQuote'), 'removeFavouriteQuote missing');
  assert.ok(favScreen.includes('Saved Quotes'), 'Saved Quotes header missing');
  assert.ok(favScreen.includes('No Saved Quotes Yet'), 'Empty state missing');
});

// ----------------------------------------------------
// TEST SUITE 7: Navigation & Route Guarding
// ----------------------------------------------------
console.log('\n🛡️ Test Suite 7: Navigation & Route Guarding');

test('app/_layout.js registers stack screens and enforces auth boundaries', () => {
  const layout = fs.readFileSync(path.join(ROOT, 'app/_layout.js'), 'utf8');
  assert.ok(layout.includes('<Stack.Screen name="favourites" />'), 'favourites Stack.Screen missing');
  assert.ok(layout.includes('<Stack.Screen name="(tabs)" />'), 'tabs Stack.Screen missing');
  assert.ok(layout.includes('<Stack.Screen name="journal" />'), 'journal Stack.Screen missing');
  assert.ok(layout.includes('inFavourites'), 'inFavourites route protection missing');
  assert.ok(layout.includes('inTabsGroup'), 'inTabsGroup route protection missing');
});

// ----------------------------------------------------
// TEST SUITE 8: Phase 6 Visual Assets & App Configuration
// ----------------------------------------------------
console.log('\n🎨 Test Suite 8: Phase 6 Polish & Visual Assets');

test('App icon and splash assets exist and have positive file size', () => {
  const appIcon = path.join(ROOT, 'assets/images/app-icon.png');
  const splashIcon = path.join(ROOT, 'assets/images/splash-icon.png');
  const androidFg = path.join(ROOT, 'assets/images/android-icon-foreground.png');

  assert.ok(fs.existsSync(appIcon) && fs.statSync(appIcon).size > 1000, 'app-icon.png invalid');
  assert.ok(fs.existsSync(splashIcon) && fs.statSync(splashIcon).size > 1000, 'splash-icon.png invalid');
  assert.ok(fs.existsSync(androidFg) && fs.statSync(androidFg).size > 1000, 'android-icon-foreground.png invalid');
});

test('app.json is configured with MindCanvas pastel brand and icons', () => {
  const appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'));
  assert.strictEqual(appJson.expo.name, 'MindCanvas', 'App name in app.json mismatch');
  assert.strictEqual(appJson.expo.icon, './assets/images/app-icon.png', 'app icon path mismatch');
  assert.strictEqual(appJson.expo.android.adaptiveIcon.backgroundColor, '#FFF9F3', 'Android icon bg color mismatch');
});

test('profile.js is free from legacy mock text and shows live sync status', () => {
  const profile = fs.readFileSync(path.join(ROOT, 'app/(tabs)/profile.js'), 'utf8');
  assert.ok(!profile.includes('Local Mock Mode'), 'Found legacy mock mode text in profile.js');
  assert.ok(!profile.includes('configurable in Phase 6'), 'Found future phase placeholder in profile.js');
  assert.ok(profile.includes('Cloud Firestore Synced'), 'Cloud Firestore status badge missing');
});

// ----------------------------------------------------
// TEST SUITE 9: Component Import Safety & JSX Verification
// ----------------------------------------------------
console.log('\n🔍 Test Suite 9: Component Import Safety');

test('app/(tabs)/profile.js properly imports TouchableOpacity from react-native', () => {
  const profile = fs.readFileSync(path.join(ROOT, 'app/(tabs)/profile.js'), 'utf8');
  assert.ok(/import\s*\{[^}]*TouchableOpacity[^}]*\}\s*from\s*['"]react-native['"]/.test(profile), 'TouchableOpacity not imported from react-native in profile.js');
});

test('All screen and component files properly import standard React Native components they use', () => {
  const checkFiles = [
    'app/index.js',
    'app/(auth)/login.js',
    'app/(auth)/register.js',
    'app/(tabs)/home.js',
    'app/(tabs)/calendar.js',
    'app/(tabs)/insights.js',
    'app/(tabs)/profile.js',
    'app/journal/mood.js',
    'app/journal/editor.js',
    'app/favourites.js',
    'components/CustomCard.js',
    'components/CustomButton.js',
    'components/MoodCard.js',
    'components/JournalCard.js',
    'components/QuoteCard.js'
  ];

  const standardRN = ['View', 'Text', 'StyleSheet', 'TouchableOpacity', 'ScrollView', 'KeyboardAvoidingView'];

  checkFiles.forEach((fileRel) => {
    const fullPath = path.join(ROOT, fileRel);
    const content = fs.readFileSync(fullPath, 'utf8');

    // Extract import lines from react-native
    const rnImportMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]react-native['"]/);
    const importedRN = rnImportMatch
      ? rnImportMatch[1].split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    standardRN.forEach((comp) => {
      const jsxTagRegex = new RegExp(`<${comp}[\\s/>]`);
      if (jsxTagRegex.test(content)) {
        assert.ok(
          importedRN.includes(comp),
          `Component <${comp}> is rendered in ${fileRel} but not imported from 'react-native'!`
        );
      }
    });
  });
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
  console.log('🎉 ALL PHASE 1 - 6 COMPREHENSIVE TESTS PASSED!\n');
}
