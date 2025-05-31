import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import React, { useRef } from 'react'
import { Alert, Button, SafeAreaView, ScrollView, Share, StyleSheet, Text, View } from 'react-native'
import ViewShot, { captureRef } from 'react-native-view-shot'
import coran from '../../assets/book/coran.js'

function getVerseOfTheDay() {
  const total = coran.length
  const today = new Date()
  // Nombre de jours depuis une date de référence (ex: 1er janvier 2024)
  const ref = new Date(2024, 0, 1)
  const diffDays = Math.floor((today.getTime() - ref.getTime()) / (1000 * 60 * 60 * 24))
  const index = diffDays % total
  return coran[index]
}

export default function HomeScreen() {
  const verse = getVerseOfTheDay()
  const content = verse.content[0]
  const title = verse.title.split('-')[0].trim()
  const verseNumber = verse.title.split('-')[1].trim()

  const viewShotRef = useRef(null)

  const handleShare = async () => {
    try {
      const message = `${content.arabic}\n\n${content.reference}\n\nTélécharger l'application : https://coran.app`
      await Share.share({
        message,
        title: 'Verset du jour',
      })
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de partager le verset.')
    }
  }

  const handleShareInstagramStory = async () => {
    try {
      // Capture le contenu en base64
      const uri = await captureRef(viewShotRef, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });
      
      console.log('Image capturée en base64');
      
      // Création d'un fichier temporaire sur le périphérique
      const fileUri = FileSystem.documentDirectory + 'verset-du-jour.png';
      await FileSystem.writeAsStringAsync(fileUri, uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      console.log('Fichier enregistré à:', fileUri);
      
      // Vérifier si le partage est disponible
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (isAvailable) {
        console.log('Partage disponible, lancement du partage...');
        await Sharing.shareAsync(fileUri);
      } else {
        // Fallback à React Native Share si expo-sharing n'est pas disponible
        console.log('Partage via API standard');
        await Share.share({
          url: fileUri,
          message: 'Verset du jour',
        });
      }
      console.log('Partage lancé avec succès.');
    } catch (error) {
      console.log('Erreur lors du partage:', error);
      Alert.alert('Erreur', "Impossible de partager. Détail: " + JSON.stringify(error));
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <ViewShot 
          ref={viewShotRef} 
          options={{ format: 'png', quality: 1 }} 
          style={styles.viewShot}
        >
          <View style={styles.contentContainer}>
            <Text style={styles.arabic}>{content.arabic}</Text>
            <Text style={styles.reference}>{content.reference}</Text>
          </View>
        </ViewShot>
            <View style={styles.buttonContainer}>
        {/* <Button title="Partager ce verset" onPress={handleShare} /> */}
        <Button title="Share a picture of the verse" onPress={handleShareInstagramStory} />
      </View>
      </ScrollView>
  
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 24,
  },
  viewShot: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    width: '100%',
    minHeight: 100,
    alignSelf: 'stretch',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginVertical: 20,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: '#fff',
  },
  surah: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  altTitle: {
    fontSize: 16,
    color: '#888',
    fontWeight: '400',
  },
  arabic: {
    fontSize: 28,
    lineHeight: 55,
    fontWeight: '700',
    color: '#000000',
    marginVertical: 16,
    textAlign: 'center',
    fontFamily: 'Geeza Pro', // iOS font for Arabic
    flexWrap: 'wrap',
  },
  transliteration: {
    fontSize: 16,
    color: '#444',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  reference: {
    fontSize: 16,
    color: '#666666',
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
})

