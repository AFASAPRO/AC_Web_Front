<script setup>
import { computed } from 'vue'
import { useSeoMeta } from '@/composables/useSeoMeta'
import { SITE } from '@/constants/site'

import HeroSection from '@/components/sections/HeroSection.vue'
import TrustedCompanies from '@/components/sections/TrustedCompanies.vue'
import AboutSection from '@/components/sections/AboutSection.vue'
import ServicesSection from '@/components/sections/ServicesSection.vue'
import ProcessSection from '@/components/sections/ProcessSection.vue'
import PortfolioSection from '@/components/sections/PortfolioSection.vue'
import WhyChooseSection from '@/components/sections/WhyChooseSection.vue'
import IndustriesSection from '@/components/sections/IndustriesSection.vue'
import TestimonialsSection from '@/components/sections/TestimonialsSection.vue'
import TeamSection from '@/components/sections/TeamSection.vue'
import FaqSection from '@/components/sections/FaqSection.vue'
import BlogSection from '@/components/sections/BlogSection.vue'
import ContactSection from '@/components/sections/ContactSection.vue'

useSeoMeta({
  title: computed(() => `${SITE.name} \u2014 ${SITE.tagline}`),
  description: computed(
    () => 'AC Company designs and engineers modern websites, mobile apps, AI solutions, enterprise software and cloud platforms that help businesses grow.'
  ),
  url: computed(() => SITE.url),
  image: computed(() => `${SITE.url}/og-image.jpg`),
})
</script>

<template>
  <main>
    <HeroSection />
    <TrustedCompanies />
    <AboutSection />
    <ServicesSection />
    <ProcessSection />
    <PortfolioSection />
    <WhyChooseSection />
    <IndustriesSection />
    <TestimonialsSection />
    <TeamSection />
    <FaqSection />
    <BlogSection />
    <ContactSection />
  </main>
</template>
