const tr = async (text: string): Promise<string> => {
  const targetLang = navigator.language.split("-")[0] || "en"
  if (targetLang === 'es') {
    return text 
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error('Translation failed')
    }
    
    const data = await response.json()
    
    let translated = ''
    if (data && data[0]) {
      data[0].forEach((item: any) => {
        if (item[0]) translated += item[0]
      })
    }
    
    return translated || text

  } catch (error) {
    console.warn('Free translation failed, using original text:', error)
    return text 
  }
}

  
export default tr