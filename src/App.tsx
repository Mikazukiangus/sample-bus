/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveScreen, AppLanguage } from './components/Header';
import { LiveBusArrivalScreen } from './components/LiveBusArrivalScreen';
import { RouteExplorerScreen } from './components/RouteExplorerScreen';
import { NearbyStopsScreen } from './components/NearbyStopsScreen';
import { ServiceDisruptionsScreen } from './components/ServiceDisruptionsScreen';
import { ChangeStopModal } from './components/ChangeStopModal';
import { ExpandedMapModal } from './components/ExpandedMapModal';
import { AlertModal } from './components/AlertModal';
import { ShareModal } from './components/ShareModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { ProfileDrawer } from './components/ProfileDrawer';
import { ApiHealthModal } from './components/ApiHealthModal';
import { Footer } from './components/Footer';
import { POPULAR_BUS_STOPS } from './data/transitData';
import { BusStop } from './types/transit';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('live-bus-arrival');
  const [language, setLanguage] = useState<AppLanguage>('EN');
  const [currentStop, setCurrentStop] = useState<BusStop>(POPULAR_BUS_STOPS[0]); // Dhoby Ghaut Exit B (08031)
  const [unreadNotifications, setUnreadNotifications] = useState<number>(2);

  // Modal & Drawer visibility
  const [isChangeStopOpen, setIsChangeStopOpen] = useState(false);
  const [isExpandedMapOpen, setIsExpandedMapOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);

  // Modal context payload
  const [alertServiceNo, setAlertServiceNo] = useState('65');
  const [shareData, setShareData] = useState<{ serviceNo: string; arrival: string }>({
    serviceNo: '65',
    arrival: '1 min',
  });

  const handleSelectScreen = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAlert = (serviceNo: string) => {
    setAlertServiceNo(serviceNo);
    setIsAlertModalOpen(true);
  };

  const handleOpenShare = (serviceNo: string, arrival: string) => {
    setShareData({ serviceNo, arrival });
    setIsShareModalOpen(true);
  };

  const handleSelectStopCode = (code: string) => {
    const matched = POPULAR_BUS_STOPS.find((s) => s.code === code);
    if (matched) {
      setCurrentStop(matched);
      setActiveScreen('live-bus-arrival');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b] flex flex-col font-body-md antialiased selection:bg-[#ffdad8] selection:text-[#9e001f]">
      {/* Fixed Header */}
      <Header
        activeScreen={activeScreen}
        onSelectScreen={handleSelectScreen}
        language={language}
        onChangeLanguage={setLanguage}
        unreadCount={unreadNotifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onOpenHealthModal={() => setIsHealthModalOpen(true)}
        currentStopName={currentStop.name}
      />

      {/* Main Viewport Content */}
      <main className="w-full pt-28 sm:pt-24 flex-1">
        {activeScreen === 'live-bus-arrival' && (
          <LiveBusArrivalScreen
            currentStop={currentStop}
            onChangeStopClick={() => setIsChangeStopOpen(true)}
            onOpenExpandedMap={() => setIsExpandedMapOpen(true)}
            onOpenAlertModal={handleOpenAlert}
            onOpenShareModal={handleOpenShare}
            onOpenHealthModal={() => setIsHealthModalOpen(true)}
            onSelectServiceForRouteExplorer={(svcNo) => {
              setActiveScreen('route-explorer');
            }}
          />
        )}

        {activeScreen === 'route-explorer' && (
          <RouteExplorerScreen onSelectStopCode={handleSelectStopCode} />
        )}

        {activeScreen === 'nearby-stops' && (
          <NearbyStopsScreen
            currentStopCode={currentStop.code}
            onSelectStop={(stop) => setCurrentStop(stop)}
            onNavigateToArrivals={() => {
              setActiveScreen('live-bus-arrival');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeScreen === 'service-disruptions' && <ServiceDisruptionsScreen />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals and Drawers */}
      <ChangeStopModal
        isOpen={isChangeStopOpen}
        onClose={() => setIsChangeStopOpen(false)}
        currentStopCode={currentStop.code}
        onSelectStop={(stop) => setCurrentStop(stop)}
      />

      <ExpandedMapModal
        isOpen={isExpandedMapOpen}
        onClose={() => setIsExpandedMapOpen(false)}
        stopName={currentStop.name}
        stopCode={currentStop.code}
      />

      <AlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        serviceNo={alertServiceNo}
        stopName={currentStop.name}
        onConfirmAlert={(mins) => {
          // Alert confirmed
        }}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        serviceNo={shareData.serviceNo}
        stopName={currentStop.name}
        nextArrival={shareData.arrival}
      />

      <NotificationsDrawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onMarkAllRead={() => setUnreadNotifications(0)}
      />

      <ProfileDrawer
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      <ApiHealthModal
        isOpen={isHealthModalOpen}
        onClose={() => setIsHealthModalOpen(false)}
      />
    </div>
  );
}
