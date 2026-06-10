import { useEffect, useRef, useState } from 'react';
import { Camera, CameraOff, RefreshCw, Image as ImageIcon, Clipboard, Zap, ZapOff, Play, Square, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CameraViewProps {
  onCapture: (blob: string) => void;
  isScanning: boolean;
  onReadClipboard: () => void;
  isContinuous: boolean;
  setIsContinuous: (val: boolean) => void;
}

const SIMULATED_DOCUMENTS = [
  {
    id: 'medicine',
    name: 'Prescription Bottle',
    description: 'Medicine guidelines & ingredients. Perfect for detail reading.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <defs>
    <linearGradient id="bottleBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1e24" />
      <stop offset="100%" stop-color="#121214" />
    </linearGradient>
    <linearGradient id="bottleBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ea580c" />
      <stop offset="15%" stop-color="#f97316" />
      <stop offset="85%" stop-color="#ea580c" />
      <stop offset="100%" stop-color="#c2410c" />
    </linearGradient>
  </defs>
  <rect width="800" height="1000" fill="url(#bottleBg)" />
  <g transform="translate(150, 100)">
    <rect x="150" y="0" width="200" height="50" rx="10" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="4" />
    <line x1="170" y1="0" x2="170" y2="50" stroke="#cbd5e1" stroke-width="2" />
    <line x1="190" y1="0" x2="190" y2="50" stroke="#cbd5e1" stroke-width="2" />
    <line x1="210" y1="0" x2="210" y2="50" stroke="#cbd5e1" stroke-width="2" />
    <line x1="230" y1="0" x2="230" y2="50" stroke="#cbd5e1" stroke-width="2" />
    <line x1="250" y1="0" x2="250" y2="50" stroke="#cbd5e1" stroke-width="2" />
    <line x1="270" y1="0" x2="270" y2="50" stroke="#cbd5e1" stroke-width="2" />
    <line x1="290" y1="0" x2="290" y2="50" stroke="#cbd5e1" stroke-width="2" />
    <line x1="310" y1="0" x2="310" y2="50" stroke="#cbd5e1" stroke-width="2" />
    <line x1="330" y1="0" x2="330" y2="50" stroke="#cbd5e1" stroke-width="2" />
    <rect x="120" y="50" width="260" height="550" rx="30" fill="url(#bottleBody)" />
    <rect x="130" y="100" width="240" height="420" rx="5" fill="#f8fafc" />
    <rect x="130" y="100" width="240" height="50" rx="2" fill="#024e94" />
    <text x="250" y="132" font-family="'Inter', sans-serif" font-weight="950" font-size="12" fill="#ffffff" text-anchor="middle" letter-spacing="1">NATIONWIDE RX PHARMACY</text>
    <text x="145" y="175" font-family="'Inter', sans-serif" font-weight="800" font-size="13" fill="#024e94">Rx# 182-94021</text>
    <text x="355" y="175" font-family="'Inter', sans-serif" font-weight="500" font-size="10" fill="#64748b" text-anchor="end">DATE: 06/09/2026</text>
    <text x="145" y="210" font-family="'Inter', sans-serif" font-weight="900" font-size="14" fill="#0f172a">PATIENT: JONATHAN SMITH</text>
    <rect x="140" y="235" width="220" height="2" fill="#cbd5e1" />
    <text x="250" y="265" font-family="'Inter', sans-serif" font-weight="950" font-size="18" fill="#e11d48" text-anchor="middle">AMLODIPINE 10 MG</text>
    <text x="250" y="285" font-family="'Inter', sans-serif" font-weight="700" font-size="10" fill="#475569" text-anchor="middle">GENERIC FOR NORVASC / TABLETS</text>
    <rect x="140" y="305" width="220" height="2" fill="#cbd5e1" />
    <text x="145" y="330" font-family="'Inter', sans-serif" font-weight="900" font-size="12" fill="#0f172a">DIRECTIONS FOR USE:</text>
    <text x="145" y="355" font-family="'Inter', sans-serif" font-weight="800" font-size="11" fill="#0f172a">Take one (1) tablet by mouth daily in</text>
    <text x="145" y="375" font-family="'Inter', sans-serif" font-weight="800" font-size="11" fill="#0f172a">the morning for blood pressure.</text>
    <rect x="145" y="405" width="210" height="30" rx="4" fill="#fef3c7" stroke="#f59e0b" stroke-width="1" />
    <text x="250" y="424" font-family="'Inter', sans-serif" font-weight="800" font-size="9" fill="#b45309" text-anchor="middle">⚠️ MAY CAUSE DIZZINESS OR DROWSINESS</text>
    <text x="145" y="465" font-family="'Inter', sans-serif" font-weight="800" font-size="11" fill="#334155">QTY: 30</text>
    <text x="240" y="465" font-family="'Inter', sans-serif" font-weight="800" font-size="11" fill="#334155">REFILLS: 3 LEFT</text>
    <text x="355" y="465" font-family="'Inter', sans-serif" font-weight="800" font-size="10" fill="#334155" text-anchor="end">DR. S. JENKINS</text>
    <g transform="translate(170, 485)">
      <rect x="0" y="0" width="3" height="25" fill="#000" />
      <rect x="6" y="0" width="1" height="25" fill="#000" />
      <rect x="10" y="0" width="4" height="25" fill="#000" />
      <rect x="18" y="0" width="2" height="25" fill="#000" />
      <rect x="23" y="0" width="3" height="25" fill="#000" />
      <rect x="30" y="0" width="1" height="25" fill="#000" />
      <rect x="34" y="0" width="5" height="25" fill="#000" />
      <rect x="42" y="0" width="2" height="25" fill="#000" />
      <rect x="48" y="0" width="4" height="25" fill="#000" />
      <rect x="56" y="0" width="1" height="25" fill="#000" />
      <rect x="61" y="0" width="3" height="25" fill="#000" />
      <rect x="68" y="0" width="2" height="25" fill="#000" />
      <rect x="73" y="0" width="5" height="25" fill="#000" />
      <rect x="82" y="0" width="1" height="25" fill="#000" />
      <rect x="86" y="0" width="4" height="25" fill="#000" />
      <rect x="94" y="0" width="2" height="25" fill="#000" />
      <rect x="100" y="0" width="3" height="25" fill="#000" />
      <rect x="106" y="0" width="1" height="25" fill="#000" />
      <rect x="111" y="0" width="4" height="25" fill="#000" />
      <rect x="118" y="0" width="2" height="25" fill="#000" />
      <rect x="124" y="0" width="3" height="25" fill="#000" />
      <rect x="131" y="0" width="1" height="25" fill="#000" />
      <rect x="135" y="0" width="5" height="25" fill="#000" />
      <rect x="143" y="0" width="2" height="25" fill="#000" />
    </g>
  </g>
  <circle cx="750" cy="900" r="100" fill="#000000" opacity="0.15" />
</svg>`
  },
  {
    id: 'bill',
    name: 'Electric Bill',
    description: 'A mock outstanding balance warning statement detailing taxes & surcharges.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#1e1e24" />
  <g transform="translate(80, 50)">
    <rect width="640" height="900" fill="#ffffff" rx="12" />
    <rect width="640" height="120" rx="12" fill="#075985" />
    <text x="30" y="75" font-family="'Inter', sans-serif" font-weight="950" font-size="28" fill="#ffffff">METROPOLIS ENERGY</text>
    <text x="30" y="100" font-family="'Inter', sans-serif" font-weight="500" font-size="12" fill="#bae6fd">POWERING METROPOLIS SINCE 1985</text>
    <text x="610" y="55" font-family="'Inter', sans-serif" font-weight="900" font-size="14" fill="#bae6fd" text-anchor="end">UTILITY ACCOUNT PORTAL</text>
    <text x="610" y="80" font-family="'Inter', sans-serif" font-weight="900" font-size="18" fill="#ffffff" text-anchor="end">URGENT STATEMENT</text>
    <g transform="translate(30, 160)">
      <text x="0" y="20" font-family="'Inter', sans-serif" font-weight="900" font-size="13" fill="#64748b">STATEMENT DATE:</text>
      <text x="0" y="42" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#0f172a">JUNE 09, 2026</text>
      <text x="220" y="20" font-family="'Inter', sans-serif" font-weight="900" font-size="13" fill="#64748b">ACCOUNT NUMBER:</text>
      <text x="220" y="42" font-family="'Inter', sans-serif" font-weight="800" font-size="15" fill="#0f172a">9823-1082-441</text>
      <text x="440" y="20" font-family="'Inter', sans-serif" font-weight="900" font-size="13" fill="#64748b">SERVICE ADDRESS:</text>
      <text x="440" y="42" font-family="'Inter', sans-serif" font-weight="800" font-size="13" fill="#0f172a">505 ELM STREET, APT 2B</text>
    </g>
    <rect x="30" y="240" width="580" height="150" rx="8" fill="#fef2f2" stroke="#fca5a5" stroke-width="2" />
    <g transform="translate(50, 265)">
      <text x="0" y="25" font-family="'Inter', sans-serif" font-weight="950" font-size="14" fill="#991b1b">⚠️ IMMEDIATE PAYMENT REQUIRED</text>
      <text x="0" y="55" font-family="'Inter', sans-serif" font-weight="500" font-size="12" fill="#7f1d1d">Your recent payment was unsuccessful. To prevent disruption of services, pay immediately.</text>
      <text x="0" y="105" font-family="'Inter', sans-serif" font-weight="900" font-size="14" fill="#450a0a">TOTAL AMOUNT DUE:</text>
      <text x="180" y="107" font-family="'Inter', sans-serif" font-weight="950" font-size="28" fill="#b91c1c">$342.85</text>
      <text x="350" y="105" font-family="'Inter', sans-serif" font-weight="900" font-size="14" fill="#450a0a">DUE DATE:</text>
      <text x="440" y="107" font-family="'Inter', sans-serif" font-weight="950" font-size="22" fill="#b91c1c">JUNE 25, 2026</text>
    </g>
    <g transform="translate(30, 420)">
      <text x="0" y="20" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#0f172a">BILL DETAIL SUMMARY</text>
      <line x1="0" y1="35" x2="580" y2="35" stroke="#e2e8f0" stroke-width="2" />
      <text x="0" y="60" font-family="'Inter', sans-serif" font-weight="900" font-size="12" fill="#64748b">DESCRIPTION</text>
      <text x="380" y="60" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#64748b" text-anchor="end">CONSU. / RATE</text>
      <text x="580" y="60" font-family="'Inter', sans-serif" font-weight="900" font-size="12" fill="#64748b" text-anchor="end">SUBTOTAL</text>
      <line x1="0" y1="72" x2="580" y2="72" stroke="#cbd5e1" stroke-width="1" />
      <g transform="translate(0, 90)">
        <text x="0" y="10" font-family="'Inter', sans-serif" font-weight="800" font-size="13" fill="#1e293b">Electricity Service (Residential Rate)</text>
        <text x="380" y="10" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#1e293b" text-anchor="end">1,820 kWh @ $0.14</text>
        <text x="580" y="10" font-family="'Inter', sans-serif" font-weight="800" font-size="13" fill="#1e293b" text-anchor="end">$254.80</text>
        
        <text x="0" y="40" font-family="'Inter', sans-serif" font-weight="800" font-size="13" fill="#1e293b">State Environmental Carbon Tax surcharge</text>
        <text x="380" y="40" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#1e293b" text-anchor="end">Fixed</text>
        <text x="580" y="40" font-family="'Inter', sans-serif" font-weight="800" font-size="13" fill="#1e293b" text-anchor="end">$18.50</text>
        
        <text x="0" y="70" font-family="'Inter', sans-serif" font-weight="800" font-size="13" fill="#1e293b">Municipal distribution utility upkeep</text>
        <text x="380" y="70" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#1e293b" text-anchor="end">Fixed Svc</text>
        <text x="580" y="70" font-family="'Inter', sans-serif" font-weight="800" font-size="13" fill="#1e293b" text-anchor="end">$29.55</text>
        
        <text x="0" y="100" font-family="'Inter', sans-serif" font-weight="900" fill="#991b1b" font-size="13">LATE REMITTANCE SURCHARGE FEE (APRIL)</text>
        <text x="380" y="100" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#991b1b" text-anchor="end">Past Due Accrual</text>
        <text x="580" y="100" font-family="'Inter', sans-serif" font-weight="950" font-size="13" fill="#991b1b" text-anchor="end">$40.00</text>
      </g>
      <line x1="0" y1="215" x2="580" y2="215" stroke="#000000" stroke-width="2" />
      <text x="0" y="240" font-family="'Inter', sans-serif" font-weight="950" font-size="16" fill="#0f172a">TOTAL OUTSTANDING CHARGES</text>
      <text x="580" y="240" font-family="'Inter', sans-serif" font-weight="950" font-size="20" fill="#b91c1c" text-anchor="end">$342.85</text>
    </g>
    <rect x="30" y="730" width="580" height="130" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
    <g transform="translate(50, 755)">
      <text x="0" y="15" font-family="'Inter', sans-serif" font-weight="950" font-size="13" fill="#334155">HOW TO REMIT PAYMENT</text>
      <text x="0" y="38" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#475569">online: Visit MetropolisEnergy.com/pay and insert account: 9823-1082-441</text>
      <text x="0" y="58" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#475569">mail: Print the lower stub and forward a check payable to Metropolis Energy Corp,</text>
      <text x="0" y="78" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#475569">P.O. Box 920428, Metropolis, NY 10001.</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'legal',
    name: 'Legal Terms',
    description: 'Limitation of liability & indemnification text written in complex legalese jargon.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#1a1a1f" />
  <g transform="translate(80, 50)">
    <rect width="640" height="900" fill="#fcfcf9" rx="4" />
    <text x="320" y="80" font-family="'Georgia', serif" font-weight="900" font-size="18" fill="#1c1917" text-anchor="middle" letter-spacing="3">AGREEMENT &amp; TERMS OF MUTUAL RELEASE</text>
    <line x1="120" y1="95" x2="520" y2="95" stroke="#1c1917" stroke-width="1.5" />
    <text x="320" y="480" font-family="'Georgia', serif" font-weight="900" font-size="70" fill="#991b1b" fill-opacity="0.06" text-anchor="middle" transform="rotate(-30 320 480)">CONFIDENTIAL</text>
    <g transform="translate(50, 150)">
      <text x="0" y="20" font-family="'Georgia', serif" font-weight="900" font-size="14" fill="#1c1917">SECTION 14. LIMITATION OF LIABILITY &amp; INDEMNIFICATION</text>
      <text x="0" y="60" font-family="'Georgia', serif" font-weight="700" font-size="12" fill="#292524" font-style="italic">Subsection 14(a): Aggregate Maximum Exposure</text>
      <text x="0" y="90" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">Notwithstanding anything to the contrary contained herein, in no event shall the supplier,</text>
      <text x="0" y="110" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">its designated officers, executives, legal affiliates, or certified licensors be held</text>
      <text x="0" y="130" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">liable for any indirect, incidental, punitive, collateral, or consequential damages,</text>
      <text x="0" y="150" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">including but not limited to loss of revenue, operational downtime, or loss of proprietary</text>
      <text x="0" y="170" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">firmware and metadata, arising out of or in connection with the breach of this covenant,</text>
      <text x="0" y="190" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">regardless of whether such claims are based in breach of contract, tortuous non-feasance,</text>
      <text x="0" y="210" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">strict negligence, or statutory warranty breach, even if previously informed of possibility.</text>
      
      <text x="0" y="250" font-family="'Georgia', serif" font-weight="700" font-size="12" fill="#292524" font-style="italic">Subsection 14(b): Mandatory Indemnity Provisions</text>
      <text x="0" y="280" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">The purchasing party agrees to hold harmless, fully defend, and indemnify the selling</text>
      <text x="0" y="300" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">corporation from and against any third-party claims, lawsuits, administrative penalties,</text>
      <text x="0" y="320" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">or liabilities of whatever nature including reasonable attorney counsel fees resulting from</text>
      <text x="0" y="340" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">negligent integration of client hardware or failure to update systems as prescribed.</text>
      <text x="0" y="380" font-family="'Georgia', serif" font-weight="900" font-size="14" fill="#1c1917">SECTION 15. GOVERNING FORUM &amp; JURISDICTIONAL MANDATE</text>
      <text x="0" y="415" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">The interpretation and execution of these terms shall be strictly subject to, governed by,</text>
      <text x="0" y="435" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">and construed in accordance with the internal statutes of the State of Delaware, without</text>
      <text x="0" y="455" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">regard to choice of law doctrines. All formal disputes hereunder shall be resolved exclusively</text>
      <text x="0" y="475" font-family="'Georgia', serif" font-size="11.5" fill="#1c1917">in binding arbitration in Wilmington, Delaware, under AAA commercial rules.</text>
    </g>
    <g transform="translate(50, 700)">
      <line x1="0" y1="40" x2="220" y2="40" stroke="#78716c" stroke-width="1" />
      <text x="0" y="55" font-family="'Georgia', serif" font-size="10" fill="#57534e">RELEASOR SIGNATURE (CLIENT AUTHORIZED AGENT)</text>
      <text x="10" y="35" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1e3a8a">Jonathan Doe</text>
      <text x="0" y="80" font-family="'Georgia', serif" font-size="11" fill="#292524">DATE: JUNE 09, 2026</text>
      <line x1="320" y1="40" x2="540" y2="40" stroke="#78716c" stroke-width="1" />
      <text x="320" y="55" font-family="'Georgia', serif" font-size="10" fill="#57534e">RELEASEE SIGNATURE (EXECUTIVE PRINCIPAL)</text>
      <text x="330" y="35" font-family="sans-serif" font-weight="bold" font-size="14" fill="#1e3a8a">Sarah Jenkins, CEO</text>
      <text x="320" y="80" font-family="'Georgia', serif" font-size="11" fill="#292524">DATE: JUNE 09, 2026</text>
    </g>
  </g>
</svg>`
  },
  {
    id: 'menu',
    name: 'Cafe Board',
    description: 'Chalkboard daily roasts & espresso menu. Perfect to test fast itemized reading list.',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="1000" viewBox="0 0 800 1000">
  <rect width="800" height="1000" fill="#3f2314" />
  <rect x="30" y="30" width="740" height="940" fill="#1e293b" rx="6" />
  <rect x="30" y="30" width="740" height="940" fill="#111827" fill-opacity="0.3" />
  <g transform="translate(80, 80)">
    <g transform="translate(240, 40)">
      <text x="0" y="20" font-family="sans-serif" font-weight="900" font-size="24" fill="#f8fafc" text-anchor="middle">★ DAILY ROASTS &amp; COFFEE ★</text>
      <text x="0" y="50" font-family="'Georgia', serif" font-style="italic" font-size="12" fill="#a7f3d0" text-anchor="middle">ORGANIC, LOCALLY SOURCE-BREWED WITH LOVE</text>
    </g>
    <line x1="50" y1="120" x2="590" y2="120" stroke="#cbd5e1" stroke-width="2" />
    <g transform="translate(50, 160)">
      <text x="0" y="30" font-family="sans-serif" font-weight="900" font-size="20" fill="#fbcfe8" letter-spacing="2">☕ ESPRESSO &amp; LATTÉ BAR</text>
      <g transform="translate(20, 70)">
        <text x="0" y="0" font-family="sans-serif" font-weight="800" font-size="14" fill="#f8fafc">Single Origin Espresso (Shot)</text>
        <text x="500" y="0" font-family="sans-serif" font-weight="900" font-size="14" fill="#fed7aa" text-anchor="end">$3.75</text>
        <text x="0" y="40" font-family="sans-serif" font-weight="800" font-size="14" fill="#f8fafc">Classic Caffe Latte (Hot/Iced)</text>
        <text x="500" y="40" font-family="sans-serif" font-weight="900" font-size="14" fill="#fed7aa" text-anchor="end">$4.95</text>
        <text x="0" y="80" font-family="sans-serif" font-weight="800" font-size="14" fill="#f8fafc">Celestial ceremonial Matcha Latte</text>
        <text x="500" y="80" font-family="sans-serif" font-weight="900" font-size="14" fill="#fed7aa" text-anchor="end">$5.50</text>
        <text x="0" y="120" font-family="sans-serif" font-weight="800" font-size="14" fill="#f8fafc">Salted Caramel Foam cold Brew</text>
        <text x="500" y="120" font-family="sans-serif" font-weight="900" font-size="14" fill="#fed7aa" text-anchor="end">$5.25</text>
      </g>
      <text x="0" y="240" font-family="sans-serif" font-weight="900" font-size="20" fill="#fbcfe8" letter-spacing="2">🥐 ARTISAN CAFE BITES</text>
      <g transform="translate(20, 280)">
        <text x="0" y="0" font-family="sans-serif" font-weight="800" font-size="14" fill="#f8fafc">Avocado &amp; Chili Pumpkin Seed Sourdough Toast</text>
        <text x="500" y="0" font-family="sans-serif" font-weight="900" font-size="14" fill="#fed7aa" text-anchor="end">$9.25</text>
        <text x="0" y="20" font-family="sans-serif" font-size="11" fill="#94a3b8">Crushed hass avocado, organic red pepper flakes on thick rye</text>
        <text x="0" y="60" font-family="sans-serif" font-weight="800" font-size="14" fill="#f8fafc">Slow-Roasted Turkey &amp; Provolone Panini</text>
        <text x="500" y="60" font-family="sans-serif" font-weight="900" font-size="14" fill="#fed7aa" text-anchor="end">$12.00</text>
        <text x="0" y="80" font-family="sans-serif" font-size="11" fill="#94a3b8">Hickory smoked breast, sun-dried aioli, fresh basil greens</text>
      </g>
    </g>
    <line x1="50" y1="620" x2="590" y2="620" stroke="#cbd5e1" stroke-width="2" />
    <text x="320" y="660" font-family="'Georgia', serif" font-weight="500" font-style="italic" font-size="14" fill="#a7f3d0" text-anchor="middle">★ Please inform us of any severe dietary allergies before ordering ★</text>
  </g>
</svg>`
  }
];

export default function CameraView({ onCapture, isScanning, onReadClipboard, isContinuous, setIsContinuous }: CameraViewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(0);
  const [retryKey, setRetryKey] = useState(0);
  const lastCaptureTime = useRef(0);

  useEffect(() => {
    let interval: any;
    if (isContinuous && !isScanning) {
      interval = setInterval(() => {
        const now = Date.now();
        if (now - lastCaptureTime.current > 5000) { // Capture every 5 seconds in continuous mode
          captureFrame();
          lastCaptureTime.current = now;
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isContinuous, isScanning, isSimulating, selectedDoc]);

  useEffect(() => {
    async function startCamera() {
      setError(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          
          const track = stream.getVideoTracks()[0];
          const capabilities = track.getCapabilities() as any;
          if (capabilities.torch) {
            setHasTorch(true);
          }
        }
      } catch (err) {
        console.error('Camera Error:', err);
        setError('Camera access denied or unavailable in sandbox.');
      }
    }

    if (!isSimulating) {
      startCamera();
    } else {
      setHasTorch(true); // Allow mock flashlight in simulation
    }

    return () => {
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [retryKey, isSimulating]);

  const toggleTorch = async () => {
    if (isSimulating) {
      setIsTorchOn(!isTorchOn);
      return;
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const track = stream.getVideoTracks()[0];
      try {
        await track.applyConstraints({
          advanced: [{ torch: !isTorchOn } as any]
        });
        setIsTorchOn(!isTorchOn);
      } catch (err) {
        console.error('Torch Error:', err);
      }
    }
  };

  const captureFrame = () => {
    if (isSimulating) {
      const doc = SIMULATED_DOCUMENTS[selectedDoc];
      const svg64 = btoa(unescape(encodeURIComponent(doc.svg)));
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          canvas.width = 800;
          canvas.height = 1000;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, 800, 1000);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
            onCapture(dataUrl);
          }
        }
      };
      img.src = 'data:image/svg+xml;base64,' + svg64;
      return;
    }

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        onCapture(dataUrl);
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden flex items-center justify-center">
      {error && !isSimulating ? (
        <div className="flex flex-col items-center justify-center max-w-md mx-auto p-8 text-center text-white">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-pulse">
            <CameraOff size={28} className="text-red-400" />
          </div>
          
          <h2 className="text-2xl font-black mb-2 text-slate-100 tracking-tight italic">Camera Access Disallowed</h2>
          <p className="text-xs text-slate-400 leading-relaxed font-bold mb-6">
            To read documents, medicine bottles, or letters, VoiceLens needs camera permissions. You can enable them, try alternatives, or test with our interactive simulator below:
          </p>

          <button 
            onClick={() => setIsSimulating(true)}
            className="w-full flex items-center justify-center gap-2 px-5 py-4 bg-gradient-to-r from-amber-400 to-amber-500 text-black rounded-xl font-black text-xs uppercase tracking-wider active:scale-95 transition-transform hover:shadow-[0_0_25px_rgba(251,191,36,0.4)] mb-6"
          >
            <Play size={14} fill="currentColor" />
            Launch Interactive Sandbox Simulator
          </button>

          <div className="w-full space-y-3 mb-8 text-slate-300">
            <div className="flex items-start gap-3 text-left bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[10px] font-black text-teal-400">1</span>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-300">Grant Permission</p>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">Tap the lock icon 🔒 next to the web address above, or look for device/browser site permissions, and toggle Camera to "Allow".</p>
              </div>
            </div>

            <div className="flex items-start gap-3 text-left bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[10px] font-black text-teal-400">2</span>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-slate-300">Device Settings</p>
                <p className="text-[11px] text-slate-500 font-bold mt-0.5">If on a mobile device, make sure system-wide camera permissions for this app (or your browser app) are turned ON.</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 w-full">
            <button 
              onClick={() => setRetryKey(k => k + 1)}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-teal-500 text-black rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-transform hover:shadow-[0_0_20px_rgba(45,212,191,0.3)]"
            >
              <RefreshCw size={14} />
              Retry Live
            </button>
            <button 
              onClick={() => document.getElementById('gallery-input')?.click()}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 border border-slate-800 text-slate-200 rounded-xl font-bold text-xs uppercase tracking-wider active:scale-95 transition-transform hover:bg-slate-800"
            >
              <ImageIcon size={14} className="text-teal-400" />
              Upload Photo
            </button>
          </div>

          <button 
            onClick={onReadClipboard}
            className="mt-6 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal-400/80 hover:text-teal-400 active:scale-95 transition-transform"
          >
            <Clipboard size={14} />
            Read Clipboard Text Instead
          </button>
        </div>
      ) : (
        <>
          {isSimulating ? (
            <div className="relative w-full h-full bg-slate-950 flex flex-col items-center justify-center p-4">
              <div 
                className="relative max-h-[60vh] max-w-[85vw] aspect-[4/5] rounded-xl overflow-hidden shadow-2xl border border-white/5 transition-all duration-300"
                style={{
                  transform: 'perspective(1000px) rotateX(2deg) rotateY(-2deg)',
                  boxShadow: '0 25px 60px -15px rgba(0,0,0,0.9), 0 0 40px rgba(45,212,191,0.1)'
                }}
              >
                <img
                  src={`data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(SIMULATED_DOCUMENTS[selectedDoc].svg)))}`}
                  alt="Simulated Document Feed"
                  className="w-full h-full object-contain"
                />
                
                {/* Simulated Lens lighting reflection */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
              </div>

              {/* Document Tabs Selector */}
              <div className="absolute top-28 left-4 right-4 z-20 flex gap-2 overflow-x-auto pb-2 scrollbar-none pointer-events-auto justify-center">
                {SIMULATED_DOCUMENTS.map((doc, idx) => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(idx)}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-full font-black text-[9px] uppercase tracking-wider transition-all border ${
                      selectedDoc === idx
                        ? 'bg-amber-400 text-black border-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]'
                        : 'bg-black/60 text-slate-300 border-white/10 hover:bg-black/80'
                    }`}
                  >
                    {doc.name}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover grayscale-[0.2] brightness-[0.8]"
            />
          )}
          
          <AnimatePresence>
            {(isScanning || isContinuous) && (
              <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ 
                  duration: isContinuous ? 2 : 1.5, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className={`absolute left-0 w-full h-1 z-10 ${
                  isContinuous ? 'bg-amber-400 shadow-[0_0_15px_#fbbf24]' : 'bg-teal-400 shadow-[0_0_15px_#2dd4bf]'
                }`}
              />
            )}
          </AnimatePresence>

          <canvas ref={canvasRef} className="hidden" />

          {/* Guide Frame */}
          <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
            <div className="w-full h-full border-2 border-dashed border-teal-500/30 rounded-xl" />
          </div>

          <div className="absolute bottom-12 left-0 right-0 flex items-center justify-center gap-6 pointer-events-auto px-4 translate-y-[-20px]">
             <button
              onClick={() => document.getElementById('gallery-input')?.click()}
              className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center pointer-events-auto active:scale-95 transition-transform"
              aria-label="Upload from Gallery"
            >
              <ImageIcon size={20} className="text-white/60" />
            </button>

             <button
              onClick={captureFrame}
              disabled={isScanning}
              className={`w-24 h-24 rounded-full backdrop-blur-md border-4 flex items-center justify-center pointer-events-auto active:scale-95 transition-all hover:shadow-2xl ${
                isContinuous 
                  ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_30px_rgba(251,191,36,0.3)]' 
                  : isSimulating 
                    ? 'border-amber-400 bg-amber-400/10 shadow-[0_0_30px_rgba(251,191,36,0.3)]'
                    : 'border-teal-500 bg-white/10'
              }`}
              aria-label="Take Photo"
              id="capture-btn"
            >
              {isContinuous ? (
                <RotateCcw size={40} className="text-amber-400 animate-spin-slow" />
              ) : isSimulating ? (
                <Camera size={40} className="text-amber-400" />
              ) : (
                <Camera size={40} className="text-teal-400" />
              )}
            </button>

            <button
              onClick={() => setIsContinuous(!isContinuous)}
              className={`w-14 h-14 rounded-full backdrop-blur-md border transition-all flex items-center justify-center active:scale-95 ${
                isContinuous 
                  ? 'bg-amber-400 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
                  : 'bg-black/40 border-white/10'
              }`}
              aria-label="Toggle Continuous Mode"
            >
              {isContinuous ? <Square size={20} className="text-black" /> : <Play size={20} className="text-white/60" />}
            </button>

            {hasTorch && (
              <button
                onClick={toggleTorch}
                className={`w-14 h-14 rounded-full backdrop-blur-md border transition-all pointer-events-auto active:scale-95 flex items-center justify-center ${
                  isTorchOn 
                    ? 'bg-amber-400 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.4)]' 
                    : 'bg-black/40 border-white/10'
                }`}
                aria-label="Toggle Flashlight"
              >
                {isTorchOn ? <Zap size={20} className="text-black" /> : <ZapOff size={20} className="text-white/60" />}
              </button>
            )}
          </div>
          
          {isSimulating ? (
            <div className="absolute top-24 left-0 right-0 flex flex-col items-center pointer-events-none gap-1">
              <motion.div 
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-amber-400/20 backdrop-blur-md border border-amber-400/30 px-6 py-2 rounded-full flex items-center gap-2"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-400 text-[9px] font-black uppercase tracking-widest italic">Sandbox Simulation Active</span>
              </motion.div>
              
              {error && (
                <button
                  onClick={() => setIsSimulating(false)}
                  className="pointer-events-auto text-[9px] font-black uppercase tracking-wider text-teal-400 hover:text-teal-300 underline mt-1"
                >
                  Switch Back To Live Camera
                </button>
              )}
            </div>
          ) : isContinuous ? (
            <div className="absolute top-28 left-0 right-0 flex justify-center pointer-events-none">
              <motion.div 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-amber-400/20 backdrop-blur-md border border-amber-400/30 px-6 py-2 rounded-full flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest italic">Eyes Through Audio Mode</span>
              </motion.div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
