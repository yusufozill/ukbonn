

var messages_ = [];
var tools = [
    
    {
        type: "function",
        function: {
            name: "excute_database",
            description: "Executes an SQL command on the MySQL database, which contains only the 'users' table. This table is designed to store user details.",
            parameters: {
                type: "object",
                properties: {
                    command: {
                        type: "string",
                        description: "The SQL command to execute on the 'users' table, such as 'SELECT', 'INSERT', or 'UPDATE' commands to interact with the vocabulary data."
                    }
                },
                required: ["command"]
            }
        }
    },


];

const availableFunctions = {


    excute_database: excuteCommand,

};
async function ollamaA(isOn) {

    const url = 'http://localhost:11434/api/chat';
    var modelName = "llama3.2";


    const data = {
        model: modelName,
        messages: messages_,
        stream: false,
        tools: isOn ? tools : []
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            messages_.push(result.message);

            if (!result.message.tool_calls || result.message.tool_calls.length === 0) {
                console.log("The model did NOT use the function. Answer writed");
                
                return result;
            } else {
                console.log("The model USED the function. Asking to tools");


            
                for (const tool of result.message.tool_calls) {
                    if(availableFunctions[tool.function.name] === undefined) {
                        messages_.push({
                            role: 'tool',
                            content: `Function ${tool.function.name} not found`,
                        });
                        console.log(`Function ${tool.function.name} not found`);
                        continue;
                    }

                    const functionToCall = availableFunctions[tool.function.name];
                    const functionResponse = await functionToCall(tool.function.arguments);
                    // Add function response to the conversation
                    messages_.push({
                        role: 'tool',
                        content: functionResponse,
                    });
                    console.log(`Function answer: ${functionResponse}`);
                }
                // Second API call: Get final response from the model
                return await ollamaA();
            }

        } else {
            console.log(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Request failed: ${error.message}`);
    }
}

async function ollama(messages,tools, availableFunctions) {
    messages_ = [...messages];

    const url = 'http://localhost:11434/api/chat';
    var modelName = "llama3.2";


    const data = {
        model: modelName,
        messages: messages_,
        stream: false,
        tools: tools
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const result = await response.json();
            messages_.push(result.message);

            if (!result.message.tool_calls || result.message.tool_calls.length === 0) {
                console.log("The model did NOT use the function. Answer writed");
                
                return result;
            } else {
                console.log("The model USED the function. Asking to tools");


            
                for (const tool of result.message.tool_calls) {
                    if(availableFunctions[tool.function.name] === undefined) {
                        messages_.push({
                            role: 'tool',
                            content: `Function ${tool.function.name} not found`,
                        });
                        console.log(`Function ${tool.function.name} not found`);
                        continue;
                    }

                    const functionToCall = availableFunctions[tool.function.name];
                    const functionResponse = await functionToCall(tool.function.arguments);
                    // Add function response to the conversation
                    messages_.push({
                        role: 'tool',
                        content: functionResponse,
                    });
                    console.log(`Function answer: ${functionResponse}`);
                }
                // Second API call: Get final response from the model
                return await ollama();
            }

        } else {
            console.log(`Error: ${response.status} ${response.statusText}`);
        }
    } catch (error) {
        console.error(`Request failed: ${error.message}`);
    }
}