import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="rgba(255, 255, 255, 0.5)" 
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
      backdropFilter="blur(10px)"
      boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)" 
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
