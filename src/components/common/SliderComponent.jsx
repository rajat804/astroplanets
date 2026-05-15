import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

const SliderComponent = () => {
  const [banners, setBanners] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [containerHeight, setContainerHeight] = useState("auto");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({});

  const API_URL = import.meta.env.VITE_API_URL;

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Function to get image dimensions
  const getImageDimensions = useCallback((imageUrl) => {
    return new Promise((resolve) => {
      // Check cache first
      if (imageDimensions[imageUrl]) {
        resolve(imageDimensions[imageUrl]);
        return;
      }
      
      const img = new Image();
      img.src = imageUrl;
      img.onload = () => {
        const dimensions = { width: img.width, height: img.height, aspectRatio: img.height / img.width };
        setImageDimensions(prev => ({ ...prev, [imageUrl]: dimensions }));
        resolve(dimensions);
      };
      img.onerror = () => {
        resolve({ width: 1920, height: 1080, aspectRatio: 1080/1920 });
      };
    });
  }, [imageDimensions]);

  // Function to calculate container height based on current viewport width
  const calculateContainerHeight = useCallback(async () => {
    if (banners[currentSlide]?.image) {
      const dimensions = await getImageDimensions(banners[currentSlide].image);
      const viewportWidth = window.innerWidth;
      const calculatedHeight = viewportWidth * dimensions.aspectRatio;
      setContainerHeight(`${calculatedHeight}px`);
    }
  }, [currentSlide, banners, getImageDimensions]);

  // Fetch banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(`${API_URL}/hero-slides`);
        const slides = response.data.slides || response.data;
        setBanners(slides);
        
        // Get dimensions for first slide
        if (slides[0]?.image) {
          const dimensions = await getImageDimensions(slides[0].image);
          const viewportWidth = window.innerWidth;
          const calculatedHeight = viewportWidth * dimensions.aspectRatio;
          setContainerHeight(`${calculatedHeight}px`);
        }
      } catch (error) {
        console.error("Hero Banner Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, [API_URL, getImageDimensions]);

  // Update height when slide changes
  useEffect(() => {
    if (banners.length > 0) {
      calculateContainerHeight();
    }
  }, [currentSlide, banners.length, calculateContainerHeight]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (banners.length > 0) {
        calculateContainerHeight();
      }
    };

    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(resizeTimer);
    };
  }, [banners.length, calculateContainerHeight]);

  // Auto slide - slower on mobile
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, isMobile ? 6000 : 5000);
    return () => clearInterval(interval);
  }, [banners.length, isMobile]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 50) {
      nextSlide();
    }
    if (touchStart - touchEnd < -50) {
      prevSlide();
    }
    setTouchStart(0);
    setTouchEnd(0);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (isLoading) {
    return (
      <div className="w-full bg-black flex items-center justify-center" style={{ minHeight: isMobile ? '200px' : '400px' }}>
        <div className="relative">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 md:border-t-4 border-b-2 md:border-b-4 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-black">
      <div 
        className="relative w-full"
        style={{ height: containerHeight }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          {banners.map((banner, index) => (
            index === currentSlide && (
              <motion.div
                key={banner.id || index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <img
                  src={banner.image}
                  alt={banner.title || `Hero Slide ${index + 1}`}
                  className="w-full h-full object-contain"
                  style={{ 
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  loading="eager"
                  draggable="false"
                />
              </motion.div>
            )
          ))}
        </AnimatePresence>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30 pointer-events-none" />
        
        {/* Bottom Gradient for better visibility */}
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-24 lg:h-32 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Navigation Arrows - Hide on mobile */}
        {banners.length > 1 && !isMobile && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-30 
                         bg-black/50 hover:bg-black/70 backdrop-blur-sm
                         p-2 md:p-3 rounded-full text-white 
                         transition-all duration-300 hover:scale-110 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Previous slide"
            >
              <HiOutlineChevronLeft className="text-xl md:text-2xl" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-30 
                         bg-black/50 hover:bg-black/70 backdrop-blur-sm
                         p-2 md:p-3 rounded-full text-white 
                         transition-all duration-300 hover:scale-110 active:scale-95
                         focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Next slide"
            >
              <HiOutlineChevronRight className="text-xl md:text-2xl" />
            </button>
          </>
        )}

        {/* Dots Indicator - Responsive */}
        {banners.length > 1 && (
          <div className={`absolute left-1/2 -translate-x-1/2 z-30 
                          flex gap-1.5 md:gap-2
                          ${isMobile ? 'bottom-2' : 'bottom-3 md:bottom-4'}`}>
            {banners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`transition-all duration-300 rounded-full
                  focus:outline-none focus:ring-1 focus:ring-white/50
                  ${currentSlide === index 
                    ? `bg-white shadow-lg ${isMobile ? 'w-6 h-1' : 'w-8 md:w-10 h-1.5 md:h-2'}` 
                    : `bg-white/50 hover:bg-white/80 ${isMobile ? 'w-1.5 h-1' : 'w-1.5 md:w-2 h-1.5 md:h-2'}`
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Slide Counter - Mobile friendly */}
        {banners.length > 1 && (
          <div className={`absolute z-30
                          bg-black/50 backdrop-blur-sm rounded-full
                          ${isMobile 
                            ? 'top-2 right-2 px-2 py-0.5' 
                            : 'top-3 md:top-4 right-3 md:right-4 px-2.5 md:px-3 py-0.5 md:py-1'
                          }`}>
            <span className={`text-white font-medium ${isMobile ? 'text-[10px]' : 'text-xs md:text-sm'}`}>
              {currentSlide + 1} / {banners.length}
            </span>
          </div>
        )}

        {/* Progress Bar for Mobile Only */}
        {isMobile && banners.length > 1 && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/20 z-30">
            <motion.div
              className="h-full bg-gradient-to-r from-white to-amber-400"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 6, ease: "linear" }}
              key={currentSlide}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default SliderComponent;