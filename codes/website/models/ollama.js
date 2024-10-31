

var messages_ = [];
var tools = [
    // {
    //     type: 'function',
    //     function: {
    //         name: 'search_noun',
    //         description: 'Find the article of a German noun and fetch its information.',
    //         parameters: {
    //             type: 'object',
    //             properties: {
    //                 article: {
    //                     type: 'string',
    //                     description: 'The article of the German noun to search for (der, die, das).',
    //                 },
    //                 word: {
    //                     type: 'string',
    //                     description: 'The German noun to search for.',
    //                 },
    //             },
    //             required: ['article', 'word'],
    //         },
    //     },
    // },
    // {
    //     type: 'function',
    //     function: {
    //         name: 'search_verb',
    //         description: 'Fetch information about a German verb.',
    //         parameters: {
    //             type: 'object',
    //             properties: {
    //                 word: {
    //                     type: 'string',
    //                     description: 'The German verb to search for.',
    //                 },
    //             },
    //             required: ['word'],
    //         },
    //     },
    // },
    // {
    //     type: 'function',
    //     function: {
    //         name: 'search_adjective',
    //         description: 'Fetch information about a German adjective.',
    //         parameters: {
    //             type: 'object',
    //             properties: {
    //                 word: {
    //                     type: 'string',
    //                     description: 'The German adjective to search for.',
    //                 },
    //             },
    //             required: ['word'],
    //         },
    //     },
    // },
    // {
    //     type: "function",
    //     function: {
    //         name: "excute_database",
    //         description: "Executes an SQL command on the MySQL database, which contains only the 'learned_words' table. This table is designed to store vocabulary details for language learning, including columns for word information (word, translation, language, part_of_speech, article, gender, example, difficulty, category, grade), learning metrics (strength_score, review_count, learned_date, last_reviewed, last_correct, mastered), and user information (user_id). Use commands like 'SELECT * FROM learned_words', 'INSERT INTO learned_words (word, translation) VALUES (...)', or 'UPDATE learned_words SET column=value WHERE condition'.",
    //         parameters: {
    //             type: "object",
    //             properties: {
    //                 command: {
    //                     type: "string",
    //                     description: "The SQL command to execute on the 'learned_words' table, such as 'SELECT', 'INSERT', or 'UPDATE' commands to interact with the vocabulary data."
    //                 }
    //             },
    //             required: ["command"]
    //         }
    //     }
    // }
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
    // ,
    
    // {
    //     type: "function",
    //     function: {
    //         name: "add_user",
    //         description: "Adds a new user to the 'users' table in the MySQL database.",
    //         parameters: {
    //             type: "object",
    //             properties: {
    //                 user: {
    //                     type: "string",
    //                     description: "The name of the user to be added."
    //                 },
    //                 mail: {
    //                     type: "string",
    //                     description: "The email address of the user."
    //                 }
    //             },
    //             required: ["user", "mail"]
    //         }
    //     }
    // },
    // {
    //     type: "function",
    //     function: {
    //         name: "list_users",
    //         description: "Retrieves all users from the 'users' table in the MySQL database.",
    //         parameters: {
    //             type: "object",
    //             properties: {}
    //         }
    //     }
    // },
    // {
    //     type: "function",
    //     function: {
    //         name: "delete_user",
    //         description: "Deletes a user by ID from the 'users' table in the MySQL database.",
    //         parameters: {
    //             type: "object",
    //             properties: {
    //                 user_id: {
    //                     type: "integer",
    //                     description: "The ID of the user to delete."
    //                 }
    //             },
    //             required: ["user_id"]
    //         }
    //     }
    // },
    
// {
//     type: 'function',
//     function: {
//         name: 'search_article',
//         description: 'Find the article of a German noun',
//         parameters: {
//             type: 'object',
//             properties: {
//                 word: {
//                     type: 'string',
//                     description: 'The German noun to search for',
//                 },
//             },
//             required: ['word'],
//         },
//     },
// },
{
    type: 'function',
    function:
        {
            name: "get_time",
            description: "Returns the current date and time based on the provided format. Default format is 'DD/MM/YYYY HH:MM:SS'.",
            parameters: {
                type: "object",
                properties: {
                    format: {
                        type: "string",
                        description: "The desired format for the date and time. Example: 'YYYY-MM-DD HH:MM' or 'MM/DD/YYYY HH:MM:SS'."
                    }
                },
                required: ["format"]
            }
        }

}


];

const availableFunctions = {
    search_noun: searchNoun,
    search_verb: searchVerb,
    search_adjective: searchAdjective,
    search_article: searchArtikel,
    get_time: getDateTime,
    excute_database: excuteCommand,
    delete_user: deleteUser,
    list_users: listUsers,
    add_user: addUser
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