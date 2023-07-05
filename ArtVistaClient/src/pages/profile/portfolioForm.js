import React, { useEffect, useRef, useState } from 'react';
import { getArtist, postArtistPortfolio,putArtistPortfolio } from '../../API/artistPortfolio';
import { useRecoilValue } from 'recoil';
import { userAtom } from '../../constant/atomRecoil';
import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Text,
    Wrap,
    WrapItem,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    ModalCloseButton,
  Grid,
  GridItem,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'

const CreatePortfolioForm = () => {
    //const { userId, username } = useRecoilValue(userAtom);
    const userToken = localStorage.getItem('userToken');
    const parsedToken = JSON.parse(userToken);
    const userId = parsedToken.data.userId;
    const username = parsedToken.data.username;
    const formRef = useRef(null);
    const [artist, setArtist] = useState([]);

    console.log(userId + " " + username + " from profile and userAtom");

    const fetchArtist = async () => {
        try {
            const response = await getArtist();
            const artData = Array.isArray(response.data) ? response.data : [];
            setArtist(artData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchArtist();
    }, []);

    const handleArtistSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            artist_name: event.target.elements.artistname.value,
            artist_picture: event.target.elements.artistpicture.value,
            about: event.target.elements.about.value,
            masterpiece: event.target.elements.masterpiece.value,
            masterpiece_picture: event.target.elements.masterpiecepicture.value,
            contact: event.target.elements.contact.value,
            journey: event.target.elements.journey.value,
            user_id: userId,
            user_name: username,

        };

        const response = await postArtistPortfolio(formData);

        if (response && response.status) {
            console.log('Successful in adding artist', response.data);
            formRef.current.reset();

        } else {
            console.log('adding artist failed in handle submit', response);
        }

    }

    return (
        <>

            <Heading>ArtistPortfolio</Heading>
            <Box p={4}>
                <Heading>Create Art</Heading>
                <form ref={formRef} onSubmit={handleArtistSubmit}>
                    <FormControl isRequired>
                        <FormLabel color="black">Artist Name</FormLabel>
                        <Input type="text" name="artistname" placeholder="Description" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel color="black">Artist Picture</FormLabel>
                        <Input type="text" name="artistpicture" placeholder="Enter URL" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel color="black">About</FormLabel>
                        <Input type="text" name="about" placeholder="About" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel color="black">Masterpiece</FormLabel>
                        <Input type="text" name="masterpiece" placeholder="masterpiece" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel color="black">Masterpiecepicture</FormLabel>
                        <Input type="text" name="masterpiecepicture" placeholder="Enter URL" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel color="black">contact</FormLabel>
                        <Input type="number" name="contact" placeholder="Contact" />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel color="black">journey</FormLabel>
                        <Input type="text" name="journey" placeholder="Your Jounery" />
                    </FormControl>
                    <Button type="submit" width="full" colorScheme="blue">Submit</Button>

                </form>

            </Box>

        </>
    );
};

const UpdatePortfolioForm = ({ portfolio }) => {
    console.log(portfolio)
    const { userId, username } = useRecoilValue(userAtom);
    const [artist, setArtist] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        artist_name: portfolio.artist_name,
        artist_picture: portfolio.artist_picture,
        about: portfolio.about,
        masterpiece: portfolio.masterpiece,
        masterpiece_picture: portfolio.masterpiece_picture,
        contact: portfolio.contact,
        journey: portfolio.journey
    });
    const [updatedArtData, setUpdatedArtData] = useState({
        artist_id: '',
        artist_name: '',
        artist_picture: '',
        about: '',
        masterpiece: '',
        masterpiece_picture: '',
        contact: '',
        journey:'',
        user_id: '',
        user_name: '',
    });

    const artist_ID = portfolio.data.artist_id;

console.log("portfolioform " + portfolio + " id " + artist_ID  )
console.log("artistid passed " + portfolio.data.artist_id)
    const fetchArtist = async () => {
        try {
            const response = await getArtist();
            const artData = Array.isArray(response.data) ? response.data : [];
            setArtist(artData);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchArtist();
    }, []);
    const openModal = async (artistId) => {
        try {
            // const response = await getArtById(artId);
            // const artData = response.data;

            setUpdatedArtData({
                artist_id: portfolio.data.artist_id,
                artist_name: portfolio.data.artist_name,
                artist_picture: portfolio.data.artist_picture,
                about: portfolio.data.about,
                masterpiece: portfolio.data.masterpiece,
                masterpiece_picture: portfolio.data.masterpiece_picture,
                contact: portfolio.data.contact,
                journey: portfolio.data.journey,
                user_id: userId,
                user_name: username,
            });

            setIsModalOpen(true);
        } catch (error) {
            console.error('Error artist modal in form:', error);
        }
    };


    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdate = async () => {
        console.log(artist_ID + "in handleupdate form")
        try {
            const response = await putArtistPortfolio(artist_ID, updatedArtData);

            console.log('Response:', response);
            if (response && response.status === true) {

                console.log('Art updated successfully');
                setArtist(prevArt =>
                    prevArt.map(item => (item.artist_id === artist_ID ? updatedArtData : item))
                );

                closeModal();
                fetchArtist();

            } else {
                console.log('Failed to update artist');
            }
        } catch (error) {
            console.error('Error updating artist', error);
        }
    };


    return (
        <Box>
        <Wrap spacing={4} mt={4}>
            {artist &&
                artist
                    .filter((item) => item.user_id === userId) 
                    .map((item) => (
                        <WrapItem key={item.artist_id}>
                        <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
                            <Image src={item.artist_picture} alt={item.artist_name} width="200px"
                                    height="200px"/>
                            <Box p={4}>
                                <Heading as="h2" size="md" mb={2}>
                                    {item.artist_name}
                                </Heading>
                                <Text fontSize="sm" mb={2}>
                                    {item.about}
                                </Text>

                            </Box>
                            <Box p={4}>
                                <Image src={item.masterpiece_picture} alt={item.masterpiece} width="200px"
                                    height="200px"/>
                                <Heading as="h2" size="md" mb={2}>
                                    {item.masterpiece}
                                </Heading>
                                <Text>
                                    {item.journey}
                                </Text>
                            </Box>
                            <Button onClick={() => openModal(item.artist_id)}>Update</Button>


                        </Box>
                    </WrapItem>
                    ))}
        </Wrap>
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Update Artist</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Artist Name</FormLabel>
                        <Input
                            type="text"
                            value={updatedArtData.artist_name}
                            onChange={(e) =>
                                setUpdatedArtData((prevData) => ({
                                    ...prevData,
                                    artist_name: e.target.value,
                                }))
                            }
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Artist Picture</FormLabel>
                        <Input
                            type="text"
                            value={updatedArtData.artist_picture}
                            onChange={(e) =>
                                setUpdatedArtData((prevData) => ({
                                    ...prevData,
                                    artist_picture: e.target.value,
                                }))
                            }
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>About</FormLabel>
                        <Input
                            type="text"
                            value={updatedArtData.about}
                            onChange={(e) =>
                                setUpdatedArtData((prevData) => ({
                                    ...prevData,
                                    about: e.target.value,
                                }))
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Masterpiece</FormLabel>
                        <Input
                            type="text"
                            value={updatedArtData.masterpiece}
                            onChange={(e) =>
                                setUpdatedArtData((prevData) => ({
                                    ...prevData,
                                    masterpiece: e.target.value,
                                }))
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Masterpiece Picture</FormLabel>
                        <Input
                            type="text"
                            value={updatedArtData.masterpiece_picture}
                            onChange={(e) =>
                                setUpdatedArtData((prevData) => ({
                                    ...prevData,
                                    masterpiece_picture: e.target.value,
                                }))
                            }
                        />
                    </FormControl>

                    <FormControl>
                        <FormLabel>Contact</FormLabel>
                        <Input
                            type="text"
                            value={updatedArtData.contact}
                            onChange={(e) =>
                                setUpdatedArtData((prevData) => ({
                                    ...prevData,
                                    contact: e.target.value,
                                }))
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Jounery</FormLabel>
                        <Input
                            type="text"
                            value={updatedArtData.journey}
                            onChange={(e) =>
                                setUpdatedArtData((prevData) => ({
                                    ...prevData,
                                    journey: e.target.value,
                                }))
                            }
                        />
                    </FormControl>

                    
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleUpdate}>
                        Update
                    </Button>
                    <Button colorScheme="gray" ml={3} onClick={closeModal}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>

    </Box>
    );
};

export { CreatePortfolioForm, UpdatePortfolioForm };
