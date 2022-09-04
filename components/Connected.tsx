import {
  Container,
  Heading,
  VStack,
  Button,
  Text,
  HStack,
  Image,
} from "@chakra-ui/react";
import React, { FC } from "react";

const Connected: FC = () => {


  return (
    <VStack spacing="20">
      <Container>
        <VStack spacing={8}>
          <Heading color="white" size="2xl" noOfLines={1} textAlign="center">
            Welcome Build00r.
          </Heading>
          <Text color='bodyText' fontSize="xl" textAlign="center">
            Each Build00r is randomly generated and can be
            stacked to recieve <Text as="b">$DEV</Text>. Use Your{" "}
            <Text as="b">$DEV</Text> to upgrade your Build00r and recieve perks
            within the community!
          </Text>
        </VStack>
      </Container>
      <HStack spacing={10}>
        <Image src="avatars/1.png" alt="avatar" />
        <Image src="avatars/2.png" alt="avatar" />
        <Image src="avatars/3.png" alt="avatar" />
        <Image src="avatars/4.png" alt="avatar" />
        <Image src="avatars/5.png" alt="avatar" />
      </HStack>
        <Button bgColor="accent" color="white" maxW="380px">
            <Text>Mint Build00r</Text>
        </Button>
    </VStack>
  );
};

export default Connected;
