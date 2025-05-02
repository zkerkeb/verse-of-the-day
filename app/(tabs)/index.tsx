import React from 'react'
import { Alert, Button, SafeAreaView, ScrollView, Share, StyleSheet, Text } from 'react-native'
import coran from '../../assets/book/coran.js'

function getVerseOfTheDay() {
  const total = coran.length
  const today = new Date()
  // Nombre de jours depuis une date de référence (ex: 1er janvier 2024)
  const ref = new Date(2024, 0, 1)
  const diffDays = Math.floor((today - ref) / (1000 * 60 * 60 * 24))
  const index = diffDays % total
  return coran[index]
}

export default function HomeScreen() {
  const verse = getVerseOfTheDay()
  const content = verse.content[0]
  const title = verse.title.split('-')[0].trim()
  const verseNumber = verse.title.split('-')[1].trim()

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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.container}
      >
        <Text style={styles.arabic}>{content.arabic}</Text>
        <Text style={styles.reference}>{content.reference}</Text>
        <Button title="Partager ce verset" onPress={handleShare} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 128,
    paddingTop: 64,
    paddingHorizontal: 24,
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
    fontSize: 32,
    lineHeight: 60,
    fontWeight: '700',
    color: '#111',
    marginVertical: 16,
    textAlign: 'center',
    fontFamily: 'Geeza Pro', // iOS font for Arabic
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
    fontSize: 14,
    color: '#aaa',
    marginTop: 12,
    textAlign: 'center',
  },
})

