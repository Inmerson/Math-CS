#!/usr/bin/env node

/**
 * Simple test script for Math Biotech API
 * Run with: node test-api.js
 */

const API_BASE_URL = process.env.API_URL || 'http://localhost:5000';

async function testEndpoint(name, method, path, body = null) {
  console.log(`\n🧪 Testing: ${name}`);
  console.log(`   ${method} ${path}`);
  
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${API_BASE_URL}${path}`, options);
    const data = await response.json();
    
    if (response.ok) {
      console.log(`   ✅ Success:`, JSON.stringify(data, null, 2));
    } else {
      console.log(`   ❌ Failed:`, JSON.stringify(data, null, 2));
    }
    
    return data;
  } catch (error) {
    console.log(`   ❌ Error:`, error.message);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Math Biotech API Test Suite');
  console.log(`📍 Testing against: ${API_BASE_URL}`);
  
  // Health check
  await testEndpoint('Health Check', 'GET', '/health');
  
  // Matrix operations
  await testEndpoint(
    'Matrix Addition',
    'POST',
    '/api/matrix/add',
    {
      matrixA: [[1, 2], [3, 4]],
      matrixB: [[5, 6], [7, 8]]
    }
  );
  
  await testEndpoint(
    'Matrix Multiplication',
    'POST',
    '/api/matrix/multiply',
    {
      matrixA: [[1, 2], [3, 4]],
      matrixB: [[2, 0], [1, 2]]
    }
  );
  
  await testEndpoint(
    'Determinant',
    'POST',
    '/api/matrix/determinant',
    {
      matrixA: [[4, 3], [6, 3]]
    }
  );
  
  await testEndpoint(
    'Matrix Inverse',
    'POST',
    '/api/matrix/inverse',
    {
      matrixA: [[4, 7], [2, 6]]
    }
  );
  
  await testEndpoint(
    'Eigenvalues',
    'POST',
    '/api/matrix/eigenvalues',
    {
      matrixA: [[4, 1], [2, 3]]
    }
  );
  
  await testEndpoint(
    'Scalar Multiplication',
    'POST',
    '/api/matrix/scalar',
    {
      matrixA: [[1, 2], [3, 4]],
      scalar: 3
    }
  );
  
  await testEndpoint(
    'Matrix Transpose',
    'POST',
    '/api/matrix/transpose',
    {
      matrixA: [[1, 2, 3], [4, 5, 6]]
    }
  );
  
  // Exam endpoints
  await testEndpoint(
    'Save Exam Result',
    'POST',
    '/api/exam/result',
    {
      questionId: 1,
      isCorrect: true
    }
  );
  
  await testEndpoint(
    'Save Another Exam Result',
    'POST',
    '/api/exam/result',
    {
      questionId: 1,
      isCorrect: false
    }
  );
  
  await testEndpoint(
    'Get Exam Performance',
    'GET',
    '/api/exam/performance'
  );
  
  await testEndpoint(
    'Get Question Stats',
    'GET',
    '/api/exam/question/1'
  );
  
  console.log('\n\n✨ Test suite completed!');
}

// Run tests
runTests().catch(console.error);
