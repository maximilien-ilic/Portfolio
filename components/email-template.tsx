import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
  Hr,
} from '@react-email/components';

interface EmailTemplateProps {
  prenom: string;
  nom: string;
  email: string;
  message: string;
}

export function EmailTemplate({ prenom, nom, email, message }: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ backgroundColor: '#ffffff', padding: '20px', margin: '0 auto' }}>
          <Heading>Nouveau message de contact</Heading>
          
          <Text><strong>De :</strong> {prenom} {nom}</Text>
          <Text><strong>Email :</strong> {email}</Text>
          
          <Hr />
          
          <Text><strong>Message :</strong></Text>
          <Text>{message}</Text>
        </Container>
      </Body>
    </Html>
  );
}