import React,{useState} from 'react'
import { FormControl, FormLabel, InputGroup, InputRightElement, VStack,Button, useToast } from '@chakra-ui/react'
import { Input } from '@chakra-ui/react'
import axios from 'axios'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'


const SignUp = () => {
const [show, setShow] = useState(false)
const [name, setName] = useState()
const [email, setEmail] = useState()
const [password, setPassword] = useState()
const [confirmPassword, setConfirmPassword] = useState()
const [picture, setPicture] = useState()
const [picLoading, setPicLoading] = useState(false);
const toast = useToast()
const history = useHistory()

const handleClick = ()=>setShow(!show)


const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dxoqyj2vo");
      fetch("https://api.cloudinary.com/v1_1/dxoqyj2vo/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPicture(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
      return;
    }
  };

const submitHandler = async () => {
setPicLoading(true)
if (!name || !email || !password || !confirmPassword) {
    toast({
      title: "Please Fill all the Fields",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    setPicLoading(false);
    return;
  }
  if (password !== confirmPassword) {
    toast({
      title: "Passwords Do Not Match",
      status: "warning",
      duration: 5000,
      isClosable: true,
      position: "bottom",
    });
    return;
  }
  try {
    const config = {
        headers:{
            "Content-type":"application/json",
        },
    }
    const {data} = await axios.post(
        "/api/user",{
            name, email,password,picture
        },config
    );
    toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setPicLoading(false)
      history.push("/chats")

  } catch (error) {
    toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setPicLoading(false);
    
  }
}
  return (
<VStack spacing='5px'>
    <FormControl id='first-name' isRequired>
        <FormLabel>
          Name
        </FormLabel>
        <Input placeholder='Enter Your Name'
        onChange={(e)=>setName(e.target.value) }/>
    </FormControl>
    <FormControl id='email' isRequired>
        <FormLabel>
          Email
        </FormLabel>
        <Input placeholder='Enter Your Email'
        onChange={(e)=>setEmail(e.target.value) }/>
    </FormControl>
    <FormControl id='password' isRequired>
        <FormLabel>
          Password
        </FormLabel>
        <InputGroup>
        <Input type= {show ? 'text':'password'} placeholder='Enter Your Password'
        onChange={(e)=>setPassword(e.target.value) }/>
        <InputRightElement width={"4.5rem"}>
            <Button h='1.75rem' size="sm" onClick={handleClick} >
                {show ? "Hide" : "Show"}
            </Button>
        </InputRightElement>
        </InputGroup>
        
    </FormControl>
    <FormControl id='confirm-password' isRequired>
        <FormLabel>
          Confirm Password
        </FormLabel>
        <InputGroup>
        <Input type= {show ? 'text':'password'} placeholder='Enter Your Confirm Password'
        onChange={(e)=>setConfirmPassword(e.target.value) }/>
        <InputRightElement width={"4.5rem"}>
            <Button h='1.75rem' size="sm" onClick={handleClick} >
                {show ? "Hide" : "Show"}
            </Button>
        </InputRightElement>
        </InputGroup>
        
    </FormControl>
    <FormControl id='picture' isRequired>
        <FormLabel>
          Upload Your Picture
        </FormLabel>
        <Input type="file"p={1.5} accept='image/*'
        onChange={(e)=>postDetails(e.target.files[0]) }/>
    </FormControl>
   <Button colorScheme='blue' width={"100%"} style={{marginTop:15}} onClick={submitHandler} isLoading={picLoading}>Sign Up</Button>
   
</VStack>
  )
}

export default SignUp;