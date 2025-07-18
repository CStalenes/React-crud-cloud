#!/usr/bin/env node

import fetch from 'node-fetch';
import process from 'process';

// Configuration des tests
const BASE_URL = 'http://localhost:5150';
const TIMEOUT = 5000;

// Fonction pour faire des requêtes HTTP
async function makeRequest(url, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Tests individuels
const tests = [
  {
    name: 'Test de connectivité du serveur',
    test: async () => {
      const response = await makeRequest(`${BASE_URL}/api/products`);
      return response.status === 200 || response.status === 404;
    }
  },
  {
    name: 'Test GET /api/products',
    test: async () => {
      const response = await makeRequest(`${BASE_URL}/api/products`);
      const data = await response.json();
      return response.status === 200 && Array.isArray(data);
    }
  },
  {
    name: 'Test POST /api/products (créer un produit)',
    test: async () => {
      const productData = {
        name: 'Test Product',
        quantity: 10,
        price: 99.99
      };
      
      const response = await makeRequest(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
      });
      
      return response.status === 201;
    }
  },
  {
    name: 'Test validation (produit invalide)',
    test: async () => {
      const invalidProduct = {
        name: '', // Nom vide (invalide)
        quantity: -5, // Quantité négative (invalide)
        price: 'invalid' // Prix invalide
      };
      
      const response = await makeRequest(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(invalidProduct)
      });
      
      return response.status === 400;
    }
  },
  {
    name: 'Test uploads statiques',
    test: async () => {
      const response = await makeRequest(`${BASE_URL}/uploads/`);
      return response.status === 200 || response.status === 404;
    }
  }
];

// Fonction pour exécuter un test
async function runTest(test) {
  try {
    const success = await test.test();
    return {
      name: test.name,
      success,
      error: null
    };
  } catch (error) {
    return {
      name: test.name,
      success: false,
      error: error.message
    };
  }
}

// Fonction pour exécuter tous les tests
async function runAllTests() {
  console.log('🧪 Démarrage des tests du backend...\n');
  
  const results = [];
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    process.stdout.write(`🔍 ${test.name}... `);
    
    const result = await runTest(test);
    results.push(result);
    
    if (result.success) {
      console.log('✅ PASS');
      passed++;
    } else {
      console.log('❌ FAIL');
      if (result.error) {
        console.log(`   Erreur: ${result.error}`);
      }
      failed++;
    }
  }

  console.log('\n📊 Résultats des tests:');
  console.log(`✅ Réussis: ${passed}`);
  console.log(`❌ Échecs: ${failed}`);
  console.log(`📋 Total: ${passed + failed}`);
  console.log(`📈 Taux de réussite: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed > 0) {
    console.log('\n💡 Suggestions pour les échecs:');
    console.log('   • Vérifiez que le serveur est démarré');
    console.log('   • Vérifiez la connexion à MySQL Azure');
    console.log('   • Vérifiez les logs du serveur');
  }

  return passed === tests.length;
}

// Fonction pour tester la connexion de base
async function testConnection() {
  console.log('🔗 Test de connexion de base...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/products`);
    if (response.status === 200 || response.status === 404) {
      console.log('✅ Serveur accessible');
      return true;
    } else {
      console.log(`❌ Serveur répond avec le statut ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Impossible de se connecter: ${error.message}`);
    return false;
  }
}

// Fonction principale
async function main() {
  console.log('🚀 Testeur du backend React-CRUD\n');
  
  // Test de connexion initial
  const connected = await testConnection();
  
  if (!connected) {
    console.log('\n💡 Suggestions:');
    console.log('   • Démarrez le serveur: npm start');
    console.log('   • Ou utilisez: node start-backend.js');
    console.log('   • Vérifiez le fichier .env');
    process.exit(1);
  }
  
  // Exécuter tous les tests
  const allPassed = await runAllTests();
  
  if (allPassed) {
    console.log('\n🎉 Tous les tests sont passés! Le backend fonctionne correctement.');
  } else {
    console.log('\n⚠️  Certains tests ont échoué. Vérifiez la configuration.');
  }
}

// Exécuter si appelé directement
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main();
} 