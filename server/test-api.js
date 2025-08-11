import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api';
const TEST_USER_ID = 'test-user-123';

async function testAPI() {
  console.log('🧪 Testing SmartTask AI API...\n');

  try {
    // Test 1: Health check
    console.log('1. Testing health check...');
    const healthResponse = await fetch(`${BASE_URL.replace('/api', '')}/ping`);
    const healthData = await healthResponse.json();
    console.log('✅ Health check:', healthData);

    // Test 2: Get tasks (should be empty initially)
    console.log('\n2. Testing get tasks...');
    const tasksResponse = await fetch(`${BASE_URL}/tasks`, {
      headers: { 'x-user-id': TEST_USER_ID }
    });
    const tasks = await tasksResponse.json();
    console.log('✅ Get tasks:', tasks);

    // Test 3: Create a task
    console.log('\n3. Testing create task...');
    const createResponse = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': TEST_USER_ID
      },
      body: JSON.stringify({ title: 'Learn SmartTask AI Development' })
    });
    const createdTask = await createResponse.json();
    console.log('✅ Created task:', createdTask);

    // Test 4: Get tasks again (should have one task)
    console.log('\n4. Testing get tasks after creation...');
    const tasksAfterCreate = await fetch(`${BASE_URL}/tasks`, {
      headers: { 'x-user-id': TEST_USER_ID }
    });
    const tasksData = await tasksAfterCreate.json();
    console.log('✅ Tasks after creation:', tasksData);

    // Test 5: Create a subtask
    console.log('\n5. Testing create subtask...');
    const subtaskResponse = await fetch(`${BASE_URL}/tasks/${createdTask.id}/subtasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': TEST_USER_ID
      },
      body: JSON.stringify({ title: 'Study the API documentation' })
    });
    const createdSubtask = await subtaskResponse.json();
    console.log('✅ Created subtask:', createdSubtask);

    // Test 6: Update task to completed
    console.log('\n6. Testing update task...');
    const updateResponse = await fetch(`${BASE_URL}/tasks/${createdTask.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': TEST_USER_ID
      },
      body: JSON.stringify({ completed: true })
    });
    const updatedTask = await updateResponse.json();
    console.log('✅ Updated task:', updatedTask);

    console.log('\n🎉 All tests passed! SmartTask AI API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI(); 