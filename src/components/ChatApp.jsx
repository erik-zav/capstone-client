import React, { useState } from 'react';
import { Layout, Input, Button, List } from 'antd';

const { Header, Content, Footer } = Layout;
const API_URL = import.meta.env.VITE_SERVER_API_URL;

const ChatApp = () => {
  const [messages, setMessages] = useState(["Welcome to the Kent Chatbot. I can assist with information about Kent State professors, courses, and general campus information. Try asking 'How do I apply for FASFA?'."]);
  const [inputMessage, setInputMessage] = useState('');
  const [awaitingDepartmentResponse, setAwaitingDepartmentResponse] = useState(false);

  const [allProfessors, setAllProfessors] = useState([]);

  const handleAPIResponse = (data) => {
    if (data && data.aiResponse) {
        if (typeof data.aiResponse === 'string') {
            // Regular string responses
            setMessages(prev => [...prev, data.aiResponse]);
        } else if (data.aiResponse.aiResponse && typeof data.aiResponse.aiResponse === 'string') {
            // Nested aiResponse objects
            setMessages(prev => [...prev, data.aiResponse.aiResponse]);
        } else if (Array.isArray(data.aiResponse)) {
            // Array responses, typically from professor lists
            setAllProfessors(data.aiResponse);  // Store the complete list of professors
            setMessages(prev => [...prev, "Please type a department name or type 'All' to see all professors."]);
            setAwaitingDepartmentResponse(true);
        } else {
            // Handle unexpected data formats
            console.error("Unexpected data format:", data.aiResponse);
            setMessages(prev => [...prev, "Received unexpected data format. Please contact the administrator."]);
        }
    } else {
        // Handle cases where data.aiResponse is missing or malformed
        setMessages(prev => [...prev, "Error: Response from server is empty or malformed."]);
    }
};



const fetchProfessorsByFilter = (filter) => {
  let formattedMessage;
  if (filter.toLowerCase() === 'all') {
      formattedMessage = allProfessors.map(prof => `${prof.FNAME} ${prof.LNAME} (${prof.HOMEDEPTlong})`).join('\n');
  } else {
      const filteredProfessors = allProfessors.filter(prof => prof.HOMEDEPTlong.toLowerCase().includes(filter.toLowerCase()));
      formattedMessage = filteredProfessors.length > 0 
          ? filteredProfessors.map(prof => `${prof.FNAME} ${prof.LNAME} (${prof.HOMEDEPTlong})`).join('\n')
          : `No professors found in the department: ${filter}`;
  }
  setMessages(prev => [...prev, formattedMessage]);
  setAwaitingDepartmentResponse(false);
};




const sendMessage = async () => {
  if (inputMessage) {
      const userInput = inputMessage.trim();
      setMessages(prev => [...prev, `You: ${userInput}`]);

      if (awaitingDepartmentResponse) {
          fetchProfessorsByFilter(userInput);  // Use local filter function
      } else {
          // Make initial API call
          const response = await fetch(`${API_URL}/api/openai-response`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt: userInput })
          });
          const data = await response.json();
          handleAPIResponse(data);
      }

      setInputMessage('');
  }
};



  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ color: 'white', textAlign: 'center' }}>Kent State Chat Interface</Header>
      <Content style={{ padding: '20px', overflowY: 'scroll' }}>
        <List
          dataSource={messages}
          renderItem={message => (
            <List.Item>
              {message}
            </List.Item>
          )}
        />
      </Content>
      <Footer style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Input
          placeholder="Type a message or a command..."
          value={inputMessage}
          onChange={e => setInputMessage(e.target.value)}
          onPressEnter={sendMessage}
          style={{ width: '85%' }}
        />
        <Button type="primary" onClick={sendMessage} style={{ width: '15%' }}>
          Send
        </Button>
      </Footer>
    </Layout>
  );
};

export default ChatApp;
