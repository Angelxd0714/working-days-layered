const http = require('http');

// Import the app
const app = require('./dist/src/app.js').default;

// Start server
const server = app.listen(3003, () => {
  console.log('🧪 Test server running on port 3003');
  console.log('');
  
  // Test cases
  const testCases = [
    {
      name: "Test 1: Solo 1 día hábil",
      url: "http://localhost:3003/business-hours?days=1",
      curl: 'curl "http://localhost:3003/business-hours?days=1"'
    },
    {
      name: "Test 2: Solo 8 horas hábiles", 
      url: "http://localhost:3003/business-hours?hours=8",
      curl: 'curl "http://localhost:3003/business-hours?hours=8"'
    },
    {
      name: "Test 3: 1 día + 3 horas",
      url: "http://localhost:3003/business-hours?days=1&hours=3", 
      curl: 'curl "http://localhost:3003/business-hours?days=1&hours=3"'
    },
    {
      name: "Test 4: Con fecha específica",
      url: "http://localhost:3003/business-hours?days=1&date=2025-09-25T15:00:00.000Z",
      curl: 'curl "http://localhost:3003/business-hours?days=1&date=2025-09-25T15:00:00.000Z"'
    }
  ];
  
  console.log('📋 Comandos curl para probar:');
  console.log('');
  
  testCases.forEach((test, index) => {
    console.log(`${index + 1}. ${test.name}`);
    console.log(`   ${test.curl}`);
    console.log('');
  });
  
  console.log('💡 El servidor estará corriendo por 60 segundos...');
  console.log('   Puedes ejecutar los comandos curl en otra terminal');
  console.log('');
  
  // Auto-close after 60 seconds
  setTimeout(() => {
    console.log('⏰ Cerrando servidor...');
    server.close();
  }, 60000);
});

server.on('close', () => {
  console.log('✅ Servidor cerrado');
});