import React from 'react'
import HomeHero from './HomeHero'
import HomeBanner from './HomeBanner'
import FAQSection from './FAQSection'
import SupportHighlights from './SupportHighlights'

function Home({ allowSelectYourBrandFlow }) {
  return (
    <>
      <HomeHero allowSelectYourBrandFlow={allowSelectYourBrandFlow} />
      <HomeBanner />  
      <FAQSection />
      <SupportHighlights />
    </>
  )
}

export default Home;
