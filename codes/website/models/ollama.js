function getDateTime() {
    const now = new Date(); // Şu anki tarih ve saati al

    const hours = String(now.getHours()).padStart(2, '0');  // Saat
    const minutes = String(now.getMinutes()).padStart(2, '0');  // Dakika
    const seconds = String(now.getSeconds()).padStart(2, '0');  // Saniye

    return `${hours}:${minutes}:${seconds}`;  // Saat, dakika ve saniyeyi döndür
}


function getFlightTimes(args) {

    // this is where you would validate the arguments you received
    const departure = args.departure;
    const arrival = args.arrival;

    const flights = {
        "NYC-LAX": { departure: "08:00 AM", arrival: "11:30 AM", duration: "5h 30m" },
        "LAX-NYC": { departure: "02:00 PM", arrival: "10:30 PM", duration: "5h 30m" },
        "LHR-JFK": { departure: "10:00 AM", arrival: "01:00 PM", duration: "8h 00m" },
        "JFK-LHR": { departure: "09:00 PM", arrival: "09:00 AM", duration: "7h 00m" },
        "CDG-DXB": { departure: "11:00 AM", arrival: "08:00 PM", duration: "6h 00m" },
        "DXB-CDG": { departure: "03:00 AM", arrival: "07:30 AM", duration: "7h 30m" }
    };

    const key = `${departure}-${arrival}`.toUpperCase();
    return JSON.stringify(flights[key] || { error: "Flight not found" });
}

var messages_ = [];

async function ollamaA(isOn) {

    const url = 'http://localhost:11434/api/chat';
    var modelName = "llama3.2";

    var tools = [
        {
            type: 'function',
            function: {
                name: 'get_flight_times',
                description: 'Get the flight times between two cities',
                parameters: {
                    type: 'object',
                    properties: {
                        departure: {
                            type: 'string',
                            description: 'The departure city (airport code)',
                        },
                        arrival: {
                            type: 'string',
                            description: 'The arrival city (airport code)',
                        },
                    },
                    required: ['departure', 'arrival'],
                },
            },
        },
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


                const availableFunctions = {
                    get_flight_times: getFlightTimes,
                    get_time: getDateTime
                };
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
                    const functionResponse = functionToCall(tool.function.arguments);
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