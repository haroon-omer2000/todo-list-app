const AWS = require('aws-sdk');
const uuid = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.createTodo = async (event) => {
  try {
    const data = JSON.parse(event.body);
    if (!data.title) throw new Error('Title is required');
    const params = {
      TableName: process.env.TODOS_TABLE,
      Item: {
        id: uuid.v4(),
        title: data.title,
        description: data.description || '',
        completed: false,
      },
    };
    await dynamoDb.put(params).promise();
    return {
      statusCode: 201,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 400,
      body: JSON.stringify({ message: error.message || 'Internal Server Error' }),
    };
  }
};

module.exports.getTodos = async () => {
  try {
    const params = {
      TableName: process.env.TODOS_TABLE,
    };
    const result = await dynamoDb.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

module.exports.getTodo = async (event) => {
  try {
    const params = {
      TableName: process.env.TODOS_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
    };
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Todo not found' }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};

module.exports.updateTodo = async (event) => {
  try {
    const data = JSON.parse(event.body);
    if (!data.title) throw new Error('Title is required');
    const params = {
      TableName: process.env.TODOS_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
      UpdateExpression: 'set title = :title, description = :description, completed = :completed',
      ExpressionAttributeValues: {
        ':title': data.title,
        ':description': data.description || '',
        ':completed': data.completed || false,
      },
      ReturnValues: 'ALL_NEW',
      ConditionExpression: 'attribute_exists(id)', // Ensure item exists
    };
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.message.includes('ConditionalCheckFailed') ? 404 : 400,
      body: JSON.stringify({ message: error.message.includes('ConditionalCheckFailed') ? 'Todo not found' : error.message || 'Internal Server Error' }),
    };
  }
};

module.exports.deleteTodo = async (event) => {
  try {
    const params = {
      TableName: process.env.TODOS_TABLE,
      Key: {
        id: event.pathParameters.id,
      },
      ConditionExpression: 'attribute_exists(id)', // Ensure item exists
    };
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 204,
      body: '',
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.message.includes('ConditionalCheckFailed') ? 404 : 500,
      body: JSON.stringify({ message: error.message.includes('ConditionalCheckFailed') ? 'Todo not found' : 'Internal Server Error' }),
    };
  }
};