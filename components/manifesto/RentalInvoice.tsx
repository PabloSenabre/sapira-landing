"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useScrollDismiss } from "@/lib/useScrollDismiss";

interface RentalInvoiceProps {
  isOpen: boolean;
  onClose: () => void;
  inline?: boolean; // When true, renders relative to parent instead of fixed
}

// SVG Logos - Corporate Enterprise Stack
const SalesforceLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path fill="#00A1E0" d="M10.006 5.415a4.195 4.195 0 0 1 3.045-1.306c1.56 0 2.954.854 3.681 2.123a5.347 5.347 0 0 1 2.173-.463c2.942 0 5.095 2.366 5.095 5.232 0 2.866-2.153 5.232-5.095 5.232a5.21 5.21 0 0 1-.9-.078 3.835 3.835 0 0 1-3.354 1.95 3.835 3.835 0 0 1-1.652-.372 4.66 4.66 0 0 1-4.09 2.428 4.674 4.674 0 0 1-4.085-2.393 4.14 4.14 0 0 1-.619.047c-2.334 0-4.205-1.854-4.205-4.168 0-1.628.947-3.039 2.32-3.733a4.525 4.525 0 0 1-.157-1.159c0-2.496 2.066-4.521 4.62-4.521 1.303 0 2.482.533 3.323 1.39z"/>
  </svg>
);

const OracleLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path fill="#F80000" d="M16.412 4.412h-8.82a7.588 7.588 0 0 0-.008 15.176h8.828a7.588 7.588 0 0 0 0-15.176zm-.193 12.502H7.786a4.915 4.915 0 0 1 0-9.828h8.433a4.914 4.914 0 1 1 0 9.828z"/>
  </svg>
);

const SAPLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path fill="#0FAAFF" d="M0 6.064v11.872h12.13L24 6.064zm3.264 2.208h.005c.863.001 1.915.245 2.676.633l-.82 1.43c-.835-.404-1.255-.442-1.73-.467-.708-.038-1.064.215-1.069.488-.007.332.669.633 1.305.838.964.306 2.19.715 2.377 1.9L7.77 8.437h2.046l2.064 5.576-.007-5.575h2.37c2.257 0 3.318.764 3.318 2.519 0 1.575-1.09 2.514-2.936 2.514h-.763l-.01 2.094-3.588-.003-.25-.908c-.37.122-.787.189-1.23.189-.456 0-.885-.071-1.263-.2l-.358.919-2 .006.09-.462c-.029.025-.057.05-.087.074-.535.43-1.208.629-2.037.644l-.213.002a5.075 5.075 0 0 1-2.581-.675l.73-1.448c.79.467 1.286.572 1.956.558.347-.007.598-.07.761-.239a.557.557 0 0 0 .156-.369c.007-.376-.53-.553-1.185-.756-.531-.164-1.135-.389-1.606-.735-.559-.41-.825-.924-.812-1.65a1.99 1.99 0 0 1 .566-1.377c.519-.537 1.357-.863 2.363-.863zm10.597 1.67v1.904h.521c.694 0 1.247-.23 1.248-.964 0-.709-.554-.94-1.248-.94zm-5.087.767l-.748 2.362c.223.085.481.133.757.133.268 0 .52-.047.742-.126l-.736-2.37z"/>
  </svg>
);

const TeamsLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path fill="#5059C9" d="M20.625 8.127q-.55 0-1.025-.205-.475-.205-.832-.563-.358-.357-.563-.832Q18 6.053 18 5.502q0-.54.205-1.02t.563-.837q.357-.358.832-.563.474-.205 1.025-.205.54 0 1.02.205t.837.563q.358.357.563.837.205.48.205 1.02 0 .55-.205 1.025-.205.475-.563.832-.357.358-.837.563-.48.205-1.02.205zm0-3.75q-.469 0-.797.328-.328.328-.328.797 0 .469.328.797.328.328.797.328.469 0 .797-.328.328-.328.328-.797 0-.469-.328-.797-.328-.328-.797-.328zM24 10.002v5.578q0 .774-.293 1.46-.293.685-.803 1.194-.51.51-1.195.803-.686.293-1.459.293-.445 0-.908-.105-.463-.106-.85-.329-.293.95-.855 1.729-.563.78-1.319 1.336-.756.557-1.67.861-.914.305-1.898.305-1.148 0-2.162-.398-1.014-.399-1.805-1.102-.79-.703-1.312-1.664t-.674-2.086h-5.8q-.411 0-.704-.293T0 16.881V6.873q0-.41.293-.703t.703-.293h8.59q-.34-.715-.34-1.5 0-.727.275-1.365.276-.639.75-1.114.475-.474 1.114-.75.638-.275 1.365-.275t1.365.275q.639.276 1.114.75.474.475.75 1.114.275.638.275 1.365t-.275 1.365q-.276.639-.75 1.113-.475.475-1.114.75-.638.276-1.365.276-.188 0-.375-.024-.188-.023-.375-.058v1.078h10.875q.469 0 .797.328.328.328.328.797zM12.75 2.373q-.41 0-.78.158-.368.158-.638.434-.27.275-.428.639-.158.363-.158.773 0 .41.158.78.159.368.428.638.27.27.639.428.369.158.779.158.41 0 .773-.158.364-.159.64-.428.274-.27.433-.639.158-.369.158-.779 0-.41-.158-.773-.159-.364-.434-.64-.275-.275-.639-.433-.363-.158-.773-.158zM6.937 9.814h2.25V7.94H2.814v1.875h2.25v6h1.875zm10.313 7.313v-6.75H12v6.504q0 .41-.293.703t-.703.293H8.309q.152.809.556 1.5.405.691.985 1.19.58.497 1.318.779.738.281 1.582.281.926 0 1.746-.352.82-.351 1.436-.966.615-.616.966-1.43.352-.815.352-1.752zm5.25-1.547v-5.203h-3.75v6.855q.305.305.691.452.387.146.809.146.469 0 .879-.176.41-.175.715-.48.304-.305.48-.715t.176-.879Z"/>
  </svg>
);

const SageLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path fill="#00D639" d="M2.702 5.316C1.167 5.316 0 6.48 0 7.972c0 1.635 1.167 2.267 2.46 2.655 1.224.387 1.804.818 1.804 1.666 0 .86-.64 1.465-1.477 1.465-.84 0-1.566-.604-1.566-1.535 0-.516.242-.647.242-.934 0-.33-.227-.574-.599-.574-.423 0-.864.647-.864 1.566 0 1.48 1.266 2.57 2.787 2.57 1.535 0 2.701-1.163 2.701-2.656 0-1.623-1.166-2.267-2.472-2.655-1.209-.372-1.792-.818-1.792-1.666 0-.845.626-1.45 1.463-1.45.867 0 1.565.617 1.577 1.465.016.388.285.617.599.617a.592.592 0 0 0 .61-.647c-.027-1.48-1.263-2.543-2.771-2.543zm6.171 9.52c.683 0 1.21-.23 1.21-.69a.57.57 0 0 0-.557-.574c-.2 0-.341.085-.668.085-.882 0-1.577-.76-1.577-1.65 0-.962.71-1.725 1.608-1.725 1.009 0 1.65.775 1.65 1.895v2.054c0 .36.284.604.625.604.327 0 .61-.244.61-.604v-2.097c0-1.72-1.178-2.984-2.858-2.984-1.566 0-2.86 1.22-2.86 2.856 0 1.58 1.282 2.83 2.817 2.83zm6.257 3.848c1.535 0 2.701-1.163 2.701-2.656 0-1.635-1.166-2.267-2.472-2.655-1.209-.387-1.792-.818-1.792-1.666s.64-1.465 1.463-1.465c.84 0 1.577.604 1.577 1.535 0 .519-.241.647-.241.934 0 .33.226.574.583.574.441 0 .882-.647.882-1.566 0-1.48-1.278-2.57-2.801-2.57-1.535 0-2.687 1.163-2.687 2.656 0 1.623 1.152 2.267 2.46 2.655 1.224.372 1.804.818 1.804 1.666 0 .86-.64 1.45-1.462 1.45-.883 0-1.566-.601-1.578-1.465-.015-.388-.3-.604-.598-.604-.327 0-.626.216-.61.631.011 1.499 1.247 2.546 2.77 2.546zm6.171-3.849c.795 0 1.424-.229 1.862-.503.426-.272.595-.504.595-.76 0-.272-.2-.516-.568-.516-.441 0-.795.66-1.877.66-.952 0-1.707-.76-1.707-1.722 0-.95.725-1.724 1.635-1.724.982 0 1.508.647 1.508 1.062 0 .116-.085.174-.2.174h-1.194c-.326 0-.568.216-.568.503 0 .314.242.546.568.546h1.636c.625 0 1.009-.33 1.009-.89 0-1.408-1.194-2.512-2.774-2.512-1.566 0-2.83 1.263-2.83 2.84s1.312 2.842 2.905 2.842z"/>
  </svg>
);

const IBMLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path fill="#052FAD" d="M16.21 8.13l-.216-.624h-3.56v.624zm.413 1.19l-.216-.623h-3.973v.624zm2.65 7.147h3.107v-.624h-3.108zm0-1.192h3.107v-.623h-3.108zm0-1.19h1.864v-.624h-1.865zm0-1.191h1.864v-.624h-1.865zm0-1.191h1.864v-.624h-3.555l-.175.504-.175-.504h-3.555v.624h1.865v-.574l.2.574h3.33l.2-.574zm1.864-1.815h-3.142l-.217.624h3.359zm-7.46 3.006h1.865v-.624h-1.865zm0 1.19h1.865v-.623h-1.865zm-1.243 1.191h3.108v-.623h-3.108zm0 1.192h3.108v-.624h-3.108zm6.386-8.961l-.216.624h3.776v-.624zm-.629 1.815h4.19v-.624h-3.974zm-4.514 1.19h3.359l-.216-.623h-3.143zm2.482 2.383h2.496l.218-.624h-2.932zm.417 1.19h1.662l.218-.623h-2.098zm.416 1.191h.83l.218-.623h-1.266zm.414 1.192l.217-.624h-.432zm-12.433-.006l4.578.006c.622 0 1.18-.237 1.602-.624h-6.18zm4.86-3v.624h2.092c0-.216-.03-.425-.083-.624zm-3.616.624h1.865v-.624H6.217zm3.617-3.573h2.008c.053-.199.083-.408.083-.624H9.834zm-3.617 0h1.865v-.624H6.217zM9.55 7.507H4.973v.624h6.18a2.36 2.36 0 00-1.602-.624zm2.056 1.191H4.973v.624h6.884a2.382 2.382 0 00-.25-.624zm-5.39 2.382v.624h4.87c.207-.176.382-.387.519-.624zm4.87 1.191h-4.87v.624h5.389a2.39 2.39 0 00-.519-.624zm-6.114 3.006h6.634c.11-.193.196-.402.25-.624H4.973zM0 8.13h4.352v-.624H0zm0 1.191h4.352v-.624H0zm1.243 1.191h1.865v-.624H1.243zm0 1.191h1.865v-.624H1.243zm0 1.19h1.865v-.623H1.243zm0 1.192h1.865v-.624H1.243zM0 15.276h4.352v-.623H0zm0 1.192h4.352v-.624H0Z"/>
  </svg>
);

const Dynamics365Logo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path fill="#002050" d="M15.805 11.322v4.889a2.536 2.536 0 0 1-1.643 2.374l-1.732.652a.507.507 0 0 1-.686-.475v-5.956l-3.392 1.239a1.015 1.015 0 0 0-.664.953v7.986c0 .705.7 1.195 1.363.953l10.161-3.713a2.535 2.535 0 0 0 1.666-2.382V7.696a2.537 2.537 0 0 1-1.666 2.381l-3.407 1.245Zm0-.532V9.323a2.537 2.537 0 0 0-1.645-2.375l-1.728-.65a.508.508 0 0 0-.686.475v4.59c0 .701-.695 1.191-1.355.956L3.795 9.963a1.015 1.015 0 0 1-.674-.956V1.015c0-.701.695-1.191 1.356-.955l14.718 5.256A2.538 2.538 0 0 1 20.83 7.21c-.136.861-1.05 2.128-1.79 2.398l-3.235 1.182Z"/>
  </svg>
);

const ZoomLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path fill="#2D8CFF" d="M24 12c0 6.627-5.373 12-12 12S0 18.627 0 12 5.373 0 12 0s12 5.373 12 12zm-4.5-2.5a1 1 0 0 0-1.6-.8l-2.4 1.8V9a1.5 1.5 0 0 0-1.5-1.5H6a1.5 1.5 0 0 0-1.5 1.5v6A1.5 1.5 0 0 0 6 16.5h8a1.5 1.5 0 0 0 1.5-1.5v-1.5l2.4 1.8a1 1 0 0 0 1.6-.8v-5z"/>
  </svg>
);

const ZendeskLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path fill="#03363D" d="M11.088 3.035v13.417L0 3.035h11.088zm0 17.93H0l11.088-13.417v13.417zM12.912 20.965V7.548L24 20.965H12.912zm0-17.93H24L12.912 16.452V3.035z"/>
  </svg>
);

const HubSpotLogo = () => (
  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5">
    <path fill="#FF7A59" d="M18.164 7.93V5.084a2.198 2.198 0 0 0 1.267-1.984v-.066A2.2 2.2 0 0 0 17.231.836h-.066a2.2 2.2 0 0 0-2.2 2.198v.066c0 .867.504 1.617 1.234 1.973v2.869a5.667 5.667 0 0 0-2.828 1.37l-7.083-5.5a2.46 2.46 0 0 0 .096-.672A2.477 2.477 0 1 0 3.908 5.61a2.468 2.468 0 0 0 1.493-.505l6.964 5.406a5.677 5.677 0 0 0 .005 5.826l-2.16 2.16a2.14 2.14 0 0 0-.64-.107 2.173 2.173 0 1 0 2.172 2.172c0-.228-.039-.446-.101-.653l2.127-2.127a5.69 5.69 0 1 0 4.396-9.852zm-.989 8.222a2.83 2.83 0 1 1 .002-5.66 2.83 2.83 0 0 1-.002 5.66z"/>
  </svg>
);

const MicrosoftLogo = () => (
  <svg viewBox="0 0 21 21" className="w-3.5 h-3.5">
    <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
    <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
    <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
    <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
  </svg>
);

// Enterprise pricing - Corporate Stack
const SAAS_ITEMS = [
  { name: "Salesforce", price: 300, Logo: SalesforceLogo },
  { name: "Oracle Cloud", price: 450, Logo: OracleLogo },
  { name: "SAP S/4HANA", price: 380, Logo: SAPLogo },
  { name: "Microsoft 365", price: 57, Logo: MicrosoftLogo },
  { name: "Teams Premium", price: 10, Logo: TeamsLogo },
  { name: "Sage Intacct", price: 400, Logo: SageLogo },
  { name: "IBM Cloud", price: 250, Logo: IBMLogo },
  { name: "Dynamics 365", price: 180, Logo: Dynamics365Logo },
  { name: "Zoom Business", price: 22, Logo: ZoomLogo },
  { name: "HubSpot Pro", price: 890, Logo: HubSpotLogo },
  { name: "Zendesk Suite", price: 115, Logo: ZendeskLogo },
];

// Premium 3D Pushpin Component - Smaller and positioned correctly
function PremiumPushpin() {
  return (
    <motion.div
      className="relative z-[200] mx-auto mb-[-12px]"
      style={{
        width: 'fit-content',
      }}
      initial={{ scale: 0, y: -30 }}
      animate={{ scale: 1, y: 0 }}
      transition={{ 
        delay: 0.05, 
        type: "spring", 
        stiffness: 400, 
        damping: 15,
      }}
    >
      {/* Shadow on paper below */}
      <motion.div 
        className="absolute rounded-full left-1/2"
        style={{
          width: '16px',
          height: '6px',
          background: 'radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)',
          filter: 'blur(2px)',
          bottom: '-18px',
          transform: 'translateX(-50%)',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      />
      
      {/* Pin head - Smaller 3D sphere */}
      <motion.div 
        className="relative w-9 h-9 rounded-full cursor-default mx-auto"
        style={{
          background: `
            radial-gradient(circle at 28% 18%, 
              #ffc0c0 0%,
              #ff9090 10%,
              #ff6666 20%,
              #e74c3c 35%, 
              #d63031 50%,
              #c0392b 65%, 
              #a93226 80%, 
              #7b241c 95%
            )
          `,
          boxShadow: `
            0 4px 8px rgba(0,0,0,0.45),
            0 8px 16px rgba(0,0,0,0.3),
            0 12px 24px rgba(0,0,0,0.2),
            inset 0 -5px 10px rgba(0,0,0,0.4),
            inset 0 5px 10px rgba(255,255,255,0.2)
          `,
        }}
        initial={{ rotateY: -20 }}
        animate={{ rotateY: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 250 }}
      >
        {/* Primary highlight */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '14px',
            height: '9px',
            background: 'radial-gradient(ellipse, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.3) 50%, transparent 100%)',
            top: '4px',
            left: '7px',
            transform: 'rotate(-30deg)',
          }}
        />
        {/* Secondary highlight */}
        <div 
          className="absolute rounded-full"
          style={{
            width: '5px',
            height: '3px',
            background: 'rgba(255,255,255,0.5)',
            top: '14px',
            left: '7px',
            filter: 'blur(0.5px)',
          }}
        />
      </motion.div>
      
      {/* Pin shaft - metallic */}
      <div 
        className="mx-auto"
        style={{
          width: '3px',
          height: '14px',
          background: `linear-gradient(90deg, 
            #666 0%, 
            #aaa 25%, 
            #ddd 50%, 
            #aaa 75%, 
            #666 100%
          )`,
          borderRadius: '0 0 1px 1px',
          boxShadow: '1px 2px 4px rgba(0,0,0,0.3)',
        }}
      />
      
      {/* Pin tip */}
      <div 
        className="mx-auto"
        style={{
          width: '0',
          height: '0',
          borderLeft: '2px solid transparent',
          borderRight: '2px solid transparent',
          borderTop: '6px solid #888',
        }}
      />
    </motion.div>
  );
}

export default function RentalInvoice({ isOpen, onClose, inline = false }: RentalInvoiceProps) {
  const [showTransformation, setShowTransformation] = useState(false);
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const [showTotal, setShowTotal] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based fade out - dismisses easter egg when it leaves viewport
  const { opacity: scrollOpacity } = useScrollDismiss({
    isOpen,
    onClose,
    elementRef: containerRef,
    fadeThreshold: 0.5, // Start fading when 50% is visible
    autoClose: true,
  });

  const total = SAAS_ITEMS.reduce((sum, item) => sum + item.price, 0);

  const timestamp = new Date().toLocaleString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  useEffect(() => {
    if (!isOpen) {
      setVisibleItems([]);
      setShowTotal(false);
      setShowMessage(false);
      setShowTransformation(false);
      return;
    }

    // Staggered item reveal
    SAAS_ITEMS.forEach((_, index) => {
      setTimeout(() => {
        setVisibleItems(prev => [...prev, index]);
      }, 150 + index * 60);
    });

    setTimeout(() => setShowTotal(true), 150 + SAAS_ITEMS.length * 60 + 150);
    setTimeout(() => setShowMessage(true), 150 + SAAS_ITEMS.length * 60 + 300);
  }, [isOpen]);

  // Ticket content - shared between inline and portal modes
  const ticketContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="pointer-events-auto"
          style={{
            perspective: '1500px',
            perspectiveOrigin: 'center top',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, rotateX: -15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, rotateX: 10, scale: 0.95 }}
            transition={{ 
              type: "spring",
              damping: 20,
              stiffness: 250,
              mass: 0.8
            }}
            style={{
              transformStyle: 'preserve-3d',
            }}
          >
            <AnimatePresence mode="wait">
              {!showTransformation ? (
                <motion.div
                  key="invoice"
                  className="relative"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95, rotateX: 10 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Premium 3D Pushpin - FIRST, positioned above ticket */}
                  <PremiumPushpin />

                  {/* Thermal Paper Ticket with premium 3D effect */}
                  <motion.div 
                    className="relative"
                    style={{
                      width: '260px',
                      background: 'linear-gradient(180deg, #FFFEF8 0%, #FBF9F0 40%, #F8F6ED 70%, #F5F3EA 100%)',
                      boxShadow: `
                        0 1px 0 rgba(0,0,0,0.04),
                        0 2px 0 rgba(0,0,0,0.035),
                        0 4px 0 rgba(0,0,0,0.03),
                        0 6px 0 rgba(0,0,0,0.025),
                        0 30px 60px -20px rgba(0, 0, 0, 0.4),
                        0 20px 40px -15px rgba(0, 0, 0, 0.3),
                        0 10px 20px -10px rgba(0, 0, 0, 0.25),
                        -4px 0 20px -8px rgba(0, 0, 0, 0.15),
                        4px 0 20px -8px rgba(0, 0, 0, 0.15)
                      `,
                      fontFamily: "'Courier New', 'Courier', monospace",
                      transform: 'rotateX(3deg) rotateY(-0.5deg)',
                      transformOrigin: 'top center',
                      transformStyle: 'preserve-3d',
                      borderRadius: '3px',
                    }}
                    initial={{ rotateX: -10 }}
                    animate={{ rotateX: 3 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    {/* Top edge - clean with slight shadow for depth */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0,0,0,0.05) 0%, transparent 100%)',
                        borderRadius: '3px 3px 0 0',
                      }}
                    />

                    {/* Paper texture overlay */}
                    <div 
                      className="absolute inset-0 pointer-events-none opacity-15"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
                      }}
                    />

                    {/* Subtle fold line effect */}
                    <div 
                      className="absolute left-0 right-0 h-px opacity-10"
                      style={{
                        top: '50%',
                        background: 'linear-gradient(90deg, transparent 10%, #000 50%, transparent 90%)',
                      }}
                    />

                    {/* Header */}
                    <div className="relative px-5 pt-6 pb-3 text-center border-b border-dashed border-gray-300">
                      <div 
                        className="text-[7px] tracking-[0.35em] text-gray-400 mb-1"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        ═══════════════════════
                      </div>
                      <div 
                        className="text-[10px] tracking-[0.25em] text-gray-700 font-bold"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        SAAS CORP™
                      </div>
                      <div 
                        className="text-[7px] text-gray-500 mt-0.5 tracking-wider"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        MONTHLY SUBSCRIPTION INVOICE
                      </div>
                      <div 
                        className="text-[7px] tracking-[0.35em] text-gray-400 mt-1"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        ═══════════════════════
                      </div>
                      <div 
                        className="text-[6px] text-gray-400 mt-2 flex justify-center gap-4"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        <span>{timestamp}</span>
                        <span>INV #{Math.floor(Math.random() * 90000) + 10000}</span>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="relative px-4 py-3">
                      <div 
                        className="flex justify-between text-[6px] text-gray-500 pb-2 border-b border-dotted border-gray-300 mb-2"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        <span>SERVICE</span>
                        <span>$/USER/MO</span>
                      </div>

                      <div className="space-y-0.5">
                        {SAAS_ITEMS.map((item, index) => (
                          <motion.div
                            key={item.name}
                            className="flex items-center justify-between py-0.5"
                            initial={{ opacity: 0, x: -8 }}
                            animate={visibleItems.includes(index) ? { opacity: 1, x: 0 } : {}}
                            transition={{ duration: 0.1, ease: "easeOut" }}
                          >
                            <div className="flex items-center gap-2">
                              <div className="opacity-85">
                                <item.Logo />
                              </div>
                              <span 
                                className="text-[8px] text-gray-700"
                                style={{ fontFamily: "'Courier New', monospace" }}
                              >
                                {item.name}
                              </span>
                            </div>
                            <span 
                              className="text-[8px] text-gray-600 tabular-nums font-medium"
                              style={{ fontFamily: "'Courier New', monospace" }}
                            >
                              ${item.price}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Total */}
                    <motion.div 
                      className="relative px-4 py-3 border-t-2 border-dashed border-gray-400 bg-gradient-to-b from-gray-50/80 to-gray-100/50"
                      initial={{ opacity: 0 }}
                      animate={showTotal ? { opacity: 1 } : {}}
                    >
                      <div className="flex justify-between items-center">
                        <span 
                          className="text-[9px] font-bold text-gray-700 tracking-wider"
                          style={{ fontFamily: "'Courier New', monospace" }}
                        >
                          TOTAL
                        </span>
                        <motion.span 
                          className="text-base font-bold text-gray-900 tabular-nums"
                          style={{ fontFamily: "'Courier New', monospace" }}
                          animate={showTotal ? { scale: [1, 1.08, 1] } : {}}
                          transition={{ duration: 0.3 }}
                        >
                          ${total.toLocaleString()}<span className="text-[7px] font-normal text-gray-500">/mo</span>
                        </motion.span>
                      </div>
                    </motion.div>

                    {/* Quote */}
                    <motion.div 
                      className="relative px-4 py-4 text-center border-t border-dashed border-gray-300"
                      initial={{ opacity: 0 }}
                      animate={showMessage ? { opacity: 1 } : {}}
                    >
                      <p 
                        className="text-[8px] text-gray-600 italic leading-relaxed"
                        style={{ fontFamily: "'Courier New', monospace" }}
                      >
                        "And you still adapt to <span className="font-bold not-italic text-gray-900">THEM</span>."
                      </p>
                      
                      {/* Barcode */}
                      <div className="flex justify-center gap-px mt-3 mb-2">
                        {[...Array(32)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="bg-gray-800"
                            style={{
                              width: Math.random() > 0.5 ? '1.5px' : '1px',
                              height: '18px',
                            }}
                            initial={{ scaleY: 0 }}
                            animate={showMessage ? { scaleY: 1 } : {}}
                            transition={{ delay: i * 0.01 }}
                          />
                        ))}
                      </div>
                    </motion.div>

                    {/* CTA */}
                    <motion.div
                      className="relative px-4 pb-5"
                      initial={{ opacity: 0 }}
                      animate={showMessage ? { opacity: 1 } : {}}
                    >
                      <motion.button
                        className="w-full py-2.5 text-[8px] font-bold tracking-widest text-white rounded-sm"
                        style={{
                          background: 'linear-gradient(180deg, #1a1a1a 0%, #000 100%)',
                          fontFamily: "'Courier New', monospace",
                          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        }}
                        whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowTransformation(true)}
                      >
                        SEE THE ALTERNATIVE →
                      </motion.button>
                    </motion.div>

                    {/* Bottom torn edge */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 h-3"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='16' height='12' viewBox='0 0 16 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0 L4 12 L8 0 L12 12 L16 0 L16 12 L0 12 Z' fill='%23F5F3EA'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'bottom',
                      }}
                    />
                  </motion.div>

                  {/* Close button */}
                  <motion.button
                    className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/90 hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 text-[11px] transition-colors z-20 shadow-md"
                    style={{ backdropFilter: 'blur(4px)' }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                  >
                    ✕
                  </motion.button>
                </motion.div>
              ) : (
                /* TRANSFORMATION - Sapira elegant style */
                <motion.div
                  key="sapira"
                  className="relative"
                  initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", damping: 25 }}
                >
                  <div 
                    className="relative overflow-hidden rounded-2xl"
                    style={{
                      width: '300px',
                      background: 'linear-gradient(180deg, #0a0a0a 0%, #000 100%)',
                      boxShadow: '0 30px 60px -15px rgba(0,0,0,0.6)',
                    }}
                  >
                    <div 
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.08) 0%, transparent 60%)',
                      }}
                    />

                    <div className="relative px-10 py-14 text-center">
                      {/* Sapira Logo */}
                      <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <span 
                          className="text-white text-3xl font-light tracking-wide"
                          style={{
                            fontFamily: "'Times New Roman', 'Georgia', serif",
                            letterSpacing: '0.05em',
                          }}
                        >
                          Sapira
                        </span>
                      </motion.div>
                      
                      <motion.h2
                        className="text-white text-4xl font-light mb-2"
                        style={{ fontFamily: "'Georgia', serif" }}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        One system.
                      </motion.h2>
                      
                      <motion.h2
                        className="text-white text-4xl font-medium italic"
                        style={{ fontFamily: "'Georgia', serif" }}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        Yours.
                      </motion.h2>

                      <motion.div
                        className="mt-10 flex items-center justify-center gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <span className="text-gray-600 text-sm line-through">${total.toLocaleString()}/mo</span>
                        <span className="text-gray-600">→</span>
                        <span className="text-white text-sm font-medium">Forever yours</span>
                      </motion.div>
                    </div>
                  </div>

                  <motion.button
                    className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-white flex items-center justify-center text-gray-400 hover:text-gray-700 text-sm shadow-xl"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                  >
                    ✕
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Inline mode: render relative to parent, moves with scroll
  if (inline) {
    return (
      <div 
        ref={containerRef}
        className="absolute top-0 z-50 transition-opacity duration-150"
        style={{
          left: '-320px', // Position to the LEFT of the parent
          marginTop: '-40px',
          opacity: scrollOpacity,
        }}
      >
        {ticketContent}
      </div>
    );
  }

  // Default: fixed position (legacy behavior)
  return (
    <div
      ref={containerRef}
      className="transition-opacity duration-150"
      style={{
        position: 'fixed',
        right: '32px',
        top: '80px',
        zIndex: 9999,
        opacity: scrollOpacity,
      }}
    >
      {ticketContent}
    </div>
  );
}
