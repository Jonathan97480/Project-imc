import { rgbaColor } from '@shopify/react-native-skia'
import React from 'react'
import { Pressable, SafeAreaView, StatusBar, Text, View, Linking, Modal } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Card, ButtonComponent, BtnBackCircle } from '../components'

import globalStyles from '../styles/global'

const About = (props: any) => {
  const [modalVisible, setModalVisible] = React.useState(false)
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <StatusBar backgroundColor={'#1C2137'} />
      <ScrollView style={{ marginBottom: 10, paddingTop: 10 }}>
        <View style={{ paddingBottom: 10 }}>
          <View style={{ flexDirection: 'row' }}>
            <BtnBackCircle onPress={() => props.navigation.goBack()} />
            <Text
              style={[
                globalStyles.title,
                { textTransform: 'uppercase', width: '80%' },
                globalStyles.gap40,
              ]}>
              à propos
            </Text>
          </View>
          <Text style={[globalStyles.paragraphe, globalStyles.gap40]}>
            L’application Imc est créée par{' '}
          </Text>
          <Card
            image={require('../assets/img/jo.jpg')}
            title="Jonathan Gauvin"
            text="Développeur"
            urlTwitter="https://twitter.com/jonathanfrt9741"
            urlLinkedIn="https://www.linkedin.com/in/gauvin-jonathan/"
            urlWebsite="https://jon-dev.fr/"
            confIcon={0}
          />
          <Card
            image={require('../assets/img/ty.jpg')}
            title="Teddy Equerre"
            text="Designer"
            confIcon={1}
            urlWebsite="https://tydevelopper.fr/"
            urlLinkedIn="https://www.linkedin.com/in/teddy-equerre-514a781a2/"
            urlInstagram="https://www.instagram.com/tydevelopper/"
            urlTwitch="https://www.twitch.tv/maakyno"
          />
          <LinGneBtn text="Version" value="0.01" />
          <LinGneBtn text="Build" value="0.0001" />
          <LinGneBtn
            text="Legal"
            value=">"
            onPress={() => {
              setModalVisible(true)
            }}
          />
        </View>
        <Legal modalVisible={modalVisible} setModalVisible={setModalVisible} />
      </ScrollView>
    </SafeAreaView>
  )
}

const LinGneBtn = (props: any) => {
  return (
    <Pressable
      onPress={() => {
        if (props.onPress) {
          props.onPress()
        }
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          borderStyle: 'solid',
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(255,255,255,0.1)',
          padding: 6,
        }}>
        <Text style={{ color: '#fff' }}>{props.text}</Text>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>{props.value}</Text>
      </View>
    </Pressable>
  )
}

const Legal = (props: any) => {
  return (
    <Modal animationType="slide" visible={props.modalVisible}>
      <ScrollView style={{ backgroundColor: '#1d233e', padding: 10 }}>
        <Text style={globalStyles.title}>Jhon.Dev</Text>
        <Text style={[globalStyles.paragraphe, globalStyles.textLeft, globalStyles.gap20]}>
          * ne garantit en aucune façon l’exactitude, la précision ou l’exhaustivité des
          informations mises à disposition sur cette Application, y compris l’ensemble des
          hyperliens ou toute autre liaison informatique utilisée, directement ou indirectement, à
          partir de cette application. Les photos présentées sur cette application sont non
          contractuelles. La société Jhon.Dev s’efforce d’assurer la fiabilité de l’ensemble des
          informations diffusées, dont elle se réserve le droit de modifier ou de corriger, à tout
          moment et sans préavis, le contenu.
        </Text>
        <Text style={[globalStyles.title, globalStyles.textLeft]}>
          Décline toute responsabilité :
        </Text>
        <Text style={[globalStyles.paragraphe, globalStyles.textLeft, globalStyles.gap20]}>
          pour toute imprécision, inexactitude ou omission portant sur des informations disponibles
          sur cette application pour tout dommage susceptible de résulter du crédit accordé à ces
          informations, de leur utilisation ou de l’utilisation d’un produit ou service auquel elles
          font référence et plus généralement pour tous dommages, directs ou indirects, quelles
          qu’en soient les causes, origines, natures et conséquences, provoquées à raison de l’accès
          de quiconque à ce site, de son usage ou de l’usage d’autres sites qui lui sont liés, de
          même que de l’impossibilité d’accéder à application. Les documents contenus dans cette
          application et chacun des éléments créés pour cette application sont soumis aux
          dispositions régissant le droit de la propriété intellectuelle. Aucune licence, ni aucun
          autre droit que celui de consulter cette application, n’est conféré à quiconque au regard
          de ces mêmes dispositions. La reproduction de tous documents publiés sur cette application
          est uniquement autorisée aux fins exclusives d’information pour un usage personnel et
          privé, toute reproduction et toute utilisation de copies réalisées à d’autres fins étant
          expressément interdite.
        </Text>
        <Text style={[globalStyles.title, globalStyles.textLeft]}>
          Politique de contenu de l'application :
        </Text>
        <Text style={[globalStyles.paragraphe, globalStyles.textLeft, globalStyles.gap20]}>
          La structure générale, les textes, les animations au sens large sont des propriétés de la
          société Jhon.Dev Toute tentative de représentation totale ou partielle de l'application et
          de son contenu sans autorisation préalable de la société Jhon.Dev, est strictement
          interdite sous peine d’entrer en infraction avec le Code de la Propriété intellectuelle
          qui sanctionne les délits de contrefaçon. L’utilisateur s’engage à respecter les règles de
          propriété intellectuelle des divers contenus proposés sur notre application c’est à dire :
          Ne pas reproduire, modifier, altérer ou rediffuser, sans notre autorisation, quelque
          article, titre, applications, logiciels, logo, marque, information pour un usage autre que
          strictement privé, ce qui exclut toute reproduction à des fins professionnelles ou de
          diffusion en nombre. Ne pas recopier tout ou partie de l'application sur un autre site ou
          application. La violation de ces dispositions impératives soumet le contrevenant, et
          toutes personnes responsables, aux peines pénales et civiles prévues par la loi.
        </Text>
        <Text style={[globalStyles.title, globalStyles.textLeft]}>
          Sécurité et confidentialité des informations personnelles :
        </Text>
        <Text style={[globalStyles.paragraphe, globalStyles.textLeft, globalStyles.gap20]}>
          Cette application ne transmet pas de données personnelles à des tiers. et néffectue pas de
          traitement de données personnelles.
        </Text>

        <View style={{ padding: 10, marginBottom: 20 }}>
          <ButtonComponent
            style={[globalStyles.ButtonStyle, { backgroundColor: '#193427' }]}
            onPress={() => props.setModalVisible(false)}>
            <Text style={globalStyles.btnText}>Fermer</Text>
          </ButtonComponent>
        </View>
      </ScrollView>
    </Modal>
  )
}

export default About
