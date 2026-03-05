// ============================================
// ملف حماية تلقائي للهاتف - auto-protection.js
// يعمل بمجرد رفعه مع الموقع - لا يحتاج تعديل HTML
// ============================================

(function() {
    'use strict';
    
    // انتظر حتى تحميل الصفحة بالكامل
    window.addEventListener('load', function() {
        console.log('🛡️ بدء تشغيل نظام الحماية التلقائي...');
        
        // ========== 1. منع لقطة الشاشة (زر الطاقة + خفض الصوت) ==========
        function preventScreenshot() {
            let keyPresses = [];
            
            document.addEventListener('keydown', function(e) {
                const key = e.key;
                const time = Date.now();
                
                // تخزين آخر ضغطتين
                keyPresses.push({ key: key, time: time });
                if (keyPresses.length > 2) keyPresses.shift();
                
                // التحقق من وجود ضغطتين متتاليتين خلال 500ms
                if (keyPresses.length === 2) {
                    const keys = keyPresses.map(k => k.key);
                    const timeDiff = keyPresses[1].time - keyPresses[0].time;
                    
                    if (timeDiff < 500) {
                        // تركيبة لقطة الشاشة (Power + VolumeDown)
                        if ((keys.includes('Power') && keys.includes('AudioVolumeDown')) ||
                            (keys.includes('Power') && keys.includes('VolumeDown'))) {
                            
                            e.preventDefault();
                            showWarning('📵 تم منع لقطة الشاشة');
                            
                            // اهتزاز
                            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                            
                            // تعتيم سريع
                            document.body.style.filter = 'brightness(0.3)';
                            setTimeout(() => {
                                document.body.style.filter = 'brightness(1)';
                            }, 300);
                        }
                    }
                }
            });
        }
        
        // ========== 2. منع اللمس الطويل (حفظ الصور) ==========
        function preventLongTouch() {
            let touchTimer;
            
            document.addEventListener('touchstart', function(e) {
                touchTimer = setTimeout(function() {
                    e.preventDefault();
                    showWarning('📵 حفظ الصور غير مسموح');
                    if (navigator.vibrate) navigator.vibrate(100);
                }, 500);
            }, { passive: false });
            
            document.addEventListener('touchend', function() {
                clearTimeout(touchTimer);
            });
            
            document.addEventListener('touchmove', function() {
                clearTimeout(touchTimer);
            });
        }
        
        // ========== 3. منع القوائم المنبثقة ==========
        function preventContextMenu() {
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                showWarning('🚫 القوائم معطلة');
                return false;
            });
        }
        
        // ========== 4. منع مغادرة الصفحة (محاولة التصوير) ==========
        function preventPageLeave() {
            let leaveCount = 0;
            
            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    leaveCount++;
                    document.title = '⚠️ لا تتصور الموقع';
                    
                    if (leaveCount > 2) {
                        // إضافة علامة مائية كبيرة
                        addBigWatermark();
                    }
                } else {
                    document.title = 'Mohnad Al_kadri | مهندس من سوريا';
                }
            });
            
            window.addEventListener('blur', function() {
                document.body.style.opacity = '0.5';
            });
            
            window.addEventListener('focus', function() {
                document.body.style.opacity = '1';
            });
        }
        
        // ========== 5. إضافة علامات مائية ==========
        function addWatermarks() {
            // علامة مائية ثابتة
            const watermark = document.createElement('div');
            watermark.id = 'auto-watermark';
            watermark.innerHTML = 'MOHNAD AL_KADRI • 19 • SYRIA';
            document.body.appendChild(watermark);
            
            // علامة مائية متحركة
            const movingWatermark = document.createElement('div');
            movingWatermark.id = 'auto-moving-watermark';
            document.body.appendChild(movingWatermark);
            
            // نقاط عشوائية
            for (let i = 0; i < 15; i++) {
                const dot = document.createElement('div');
                dot.className = 'auto-dot';
                dot.style.left = Math.random() * 100 + '%';
                dot.style.top = Math.random() * 100 + '%';
                document.body.appendChild(dot);
            }
            
            // إضافة CSS تلقائياً
            const style = document.createElement('style');
            style.textContent = `
                #auto-watermark {
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    color: rgba(0, 123, 255, 0.15);
                    font-size: 12px;
                    font-family: monospace;
                    pointer-events: none;
                    z-index: 999999;
                    transform: rotate(-2deg);
                    white-space: nowrap;
                }
                
                #auto-moving-watermark {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: repeating-linear-gradient(
                        45deg,
                        rgba(0, 123, 255, 0.03) 0px,
                        rgba(0, 123, 255, 0.03) 30px,
                        transparent 30px,
                        transparent 60px
                    );
                    pointer-events: none;
                    z-index: 999998;
                    animation: autoMove 20s linear infinite;
                }
                
                .auto-dot {
                    position: fixed;
                    width: 2px;
                    height: 2px;
                    background: rgba(0, 123, 255, 0.2);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 999997;
                    animation: autoFloat 10s infinite;
                }
                
                @keyframes autoMove {
                    0% { background-position: 0 0; }
                    100% { background-position: 200px 200px; }
                }
                
                @keyframes autoFloat {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(20px, -20px); }
                }
                
                .auto-warning {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateY(-150%);
                    background: rgba(255, 0, 0, 0.95);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 50px;
                    font-weight: bold;
                    z-index: 1000000;
                    border: 2px solid white;
                    box-shadow: 0 0 50px red;
                    transition: 0.3s;
                    text-align: center;
                    font-size: 16px;
                    pointer-events: none;
                    white-space: nowrap;
                }
                
                .auto-warning.show {
                    transform: translateX(-50%) translateY(0);
                }
                
                .auto-big-watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-15deg);
                    color: rgba(255, 0, 0, 0.2);
                    font-size: 40px;
                    font-weight: bold;
                    white-space: nowrap;
                    pointer-events: none;
                    z-index: 999999;
                    font-family: 'Cairo', sans-serif;
                    animation: autoPulse 2s;
                }
                
                @keyframes autoPulse {
                    0% { opacity: 0; transform: translate(-50%, -50%) rotate(-15deg) scale(0.5); }
                    50% { opacity: 1; transform: translate(-50%, -50%) rotate(-15deg) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -50%) rotate(-15deg) scale(1.5); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // ========== 6. إضافة علامة مائية كبيرة ==========
        function addBigWatermark() {
            const big = document.createElement('div');
            big.className = 'auto-big-watermark';
            big.innerHTML = 'MOHNAD AL_KADRI';
            document.body.appendChild(big);
            
            setTimeout(() => {
                if (big.parentNode) big.remove();
            }, 2000);
        }
        
        // ========== 7. نظام التحذيرات ==========
        function showWarning(message) {
            const oldWarning = document.querySelector('.auto-warning');
            if (oldWarning) oldWarning.remove();
            
            const warning = document.createElement('div');
            warning.className = 'auto-warning';
            warning.textContent = message;
            document.body.appendChild(warning);
            
            setTimeout(() => {
                warning.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                warning.classList.remove('show');
                setTimeout(() => {
                    if (warning.parentNode) warning.remove();
                }, 500);
            }, 2000);
        }
        
        // ========== 8. منع محاولة تصوير الشاشة عبر تغير الاتجاه ==========
        function preventOrientationScreenshot() {
            let lastOrientation = window.orientation;
            let changeCount = 0;
            
            window.addEventListener('orientationchange', function() {
                changeCount++;
                
                if (changeCount > 2) {
                    showWarning('⚠️ حركة غير طبيعية');
                    addBigWatermark();
                    changeCount = 0;
                }
                
                setTimeout(() => {
                    changeCount = 0;
                }, 5000);
            });
        }
        
        // ========== 9. منع النسخ واللصق ==========
        function preventCopyPaste() {
            document.addEventListener('copy', function(e) {
                e.preventDefault();
                showWarning('❌ النسخ غير مسموح');
            });
            
            document.addEventListener('cut', function(e) {
                e.preventDefault();
                showWarning('❌ القص غير مسموح');
            });
            
            document.addEventListener('paste', function(e) {
                e.preventDefault();
                showWarning('❌ اللصق غير مسموح');
            });
        }
        
        // ========== 10. منع حفظ الصور من الصفحة ==========
        function preventImageSave() {
            document.querySelectorAll('img').forEach(function(img) {
                img.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    showWarning('❌ لا يمكن حفظ الصور');
                });
                
                img.addEventListener('dragstart', function(e) {
                    e.preventDefault();
                });
            });
        }
        
        // ========== بدء تشغيل الحماية ==========
        function startProtection() {
            console.log('✅ نظام الحماية التلقائي يعمل');
            
            preventScreenshot();
            preventLongTouch();
            preventContextMenu();
            preventPageLeave();
            addWatermarks();
            preventOrientationScreenshot();
            preventCopyPaste();
            preventImageSave();
            
            // رسالة في الكونسول
            console.log('%c👤 MOHNAD AL_KADRI - 19 SYRIA', 'color: #007BFF; font-size: 16px;');
            console.log('%c🔒 هذا الموقع محمي تلقائياً', 'color: #FFD700; font-size: 14px;');
            
            // تنبيه ترحيبي
            setTimeout(() => {
                showWarning('🔒 الموقع محمي');
            }, 1500);
        }
        
        // تشغيل الحماية
        startProtection();
    });
})();// ============================================
// ملف حماية تلقائي للهاتف - auto-protection.js
// يعمل بمجرد رفعه مع الموقع - لا يحتاج تعديل HTML
// ============================================

(function() {
    'use strict';
    
    // انتظر حتى تحميل الصفحة بالكامل
    window.addEventListener('load', function() {
        console.log('🛡️ بدء تشغيل نظام الحماية التلقائي...');
        
        // ========== 1. منع لقطة الشاشة (زر الطاقة + خفض الصوت) ==========
        function preventScreenshot() {
            let keyPresses = [];
            
            document.addEventListener('keydown', function(e) {
                const key = e.key;
                const time = Date.now();
                
                // تخزين آخر ضغطتين
                keyPresses.push({ key: key, time: time });
                if (keyPresses.length > 2) keyPresses.shift();
                
                // التحقق من وجود ضغطتين متتاليتين خلال 500ms
                if (keyPresses.length === 2) {
                    const keys = keyPresses.map(k => k.key);
                    const timeDiff = keyPresses[1].time - keyPresses[0].time;
                    
                    if (timeDiff < 500) {
                        // تركيبة لقطة الشاشة (Power + VolumeDown)
                        if ((keys.includes('Power') && keys.includes('AudioVolumeDown')) ||
                            (keys.includes('Power') && keys.includes('VolumeDown'))) {
                            
                            e.preventDefault();
                            showWarning('📵 تم منع لقطة الشاشة');
                            
                            // اهتزاز
                            if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
                            
                            // تعتيم سريع
                            document.body.style.filter = 'brightness(0.3)';
                            setTimeout(() => {
                                document.body.style.filter = 'brightness(1)';
                            }, 300);
                        }
                    }
                }
            });
        }
        
        // ========== 2. منع اللمس الطويل (حفظ الصور) ==========
        function preventLongTouch() {
            let touchTimer;
            
            document.addEventListener('touchstart', function(e) {
                touchTimer = setTimeout(function() {
                    e.preventDefault();
                    showWarning('📵 حفظ الصور غير مسموح');
                    if (navigator.vibrate) navigator.vibrate(100);
                }, 500);
            }, { passive: false });
            
            document.addEventListener('touchend', function() {
                clearTimeout(touchTimer);
            });
            
            document.addEventListener('touchmove', function() {
                clearTimeout(touchTimer);
            });
        }
        
        // ========== 3. منع القوائم المنبثقة ==========
        function preventContextMenu() {
            document.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                showWarning('🚫 القوائم معطلة');
                return false;
            });
        }
        
        // ========== 4. منع مغادرة الصفحة (محاولة التصوير) ==========
        function preventPageLeave() {
            let leaveCount = 0;
            
            document.addEventListener('visibilitychange', function() {
                if (document.hidden) {
                    leaveCount++;
                    document.title = '⚠️ لا تتصور الموقع';
                    
                    if (leaveCount > 2) {
                        // إضافة علامة مائية كبيرة
                        addBigWatermark();
                    }
                } else {
                    document.title = 'Mohnad Al_kadri | مهندس من سوريا';
                }
            });
            
            window.addEventListener('blur', function() {
                document.body.style.opacity = '0.5';
            });
            
            window.addEventListener('focus', function() {
                document.body.style.opacity = '1';
            });
        }
        
        // ========== 5. إضافة علامات مائية ==========
        function addWatermarks() {
            // علامة مائية ثابتة
            const watermark = document.createElement('div');
            watermark.id = 'auto-watermark';
            watermark.innerHTML = 'MOHNAD AL_KADRI • 19 • SYRIA';
            document.body.appendChild(watermark);
            
            // علامة مائية متحركة
            const movingWatermark = document.createElement('div');
            movingWatermark.id = 'auto-moving-watermark';
            document.body.appendChild(movingWatermark);
            
            // نقاط عشوائية
            for (let i = 0; i < 15; i++) {
                const dot = document.createElement('div');
                dot.className = 'auto-dot';
                dot.style.left = Math.random() * 100 + '%';
                dot.style.top = Math.random() * 100 + '%';
                document.body.appendChild(dot);
            }
            
            // إضافة CSS تلقائياً
            const style = document.createElement('style');
            style.textContent = `
                #auto-watermark {
                    position: fixed;
                    bottom: 10px;
                    right: 10px;
                    color: rgba(0, 123, 255, 0.15);
                    font-size: 12px;
                    font-family: monospace;
                    pointer-events: none;
                    z-index: 999999;
                    transform: rotate(-2deg);
                    white-space: nowrap;
                }
                
                #auto-moving-watermark {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: repeating-linear-gradient(
                        45deg,
                        rgba(0, 123, 255, 0.03) 0px,
                        rgba(0, 123, 255, 0.03) 30px,
                        transparent 30px,
                        transparent 60px
                    );
                    pointer-events: none;
                    z-index: 999998;
                    animation: autoMove 20s linear infinite;
                }
                
                .auto-dot {
                    position: fixed;
                    width: 2px;
                    height: 2px;
                    background: rgba(0, 123, 255, 0.2);
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 999997;
                    animation: autoFloat 10s infinite;
                }
                
                @keyframes autoMove {
                    0% { background-position: 0 0; }
                    100% { background-position: 200px 200px; }
                }
                
                @keyframes autoFloat {
                    0%, 100% { transform: translate(0, 0); }
                    50% { transform: translate(20px, -20px); }
                }
                
                .auto-warning {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%) translateY(-150%);
                    background: rgba(255, 0, 0, 0.95);
                    color: white;
                    padding: 15px 25px;
                    border-radius: 50px;
                    font-weight: bold;
                    z-index: 1000000;
                    border: 2px solid white;
                    box-shadow: 0 0 50px red;
                    transition: 0.3s;
                    text-align: center;
                    font-size: 16px;
                    pointer-events: none;
                    white-space: nowrap;
                }
                
                .auto-warning.show {
                    transform: translateX(-50%) translateY(0);
                }
                
                .auto-big-watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-15deg);
                    color: rgba(255, 0, 0, 0.2);
                    font-size: 40px;
                    font-weight: bold;
                    white-space: nowrap;
                    pointer-events: none;
                    z-index: 999999;
                    font-family: 'Cairo', sans-serif;
                    animation: autoPulse 2s;
                }
                
                @keyframes autoPulse {
                    0% { opacity: 0; transform: translate(-50%, -50%) rotate(-15deg) scale(0.5); }
                    50% { opacity: 1; transform: translate(-50%, -50%) rotate(-15deg) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -50%) rotate(-15deg) scale(1.5); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // ========== 6. إضافة علامة مائية كبيرة ==========
        function addBigWatermark() {
            const big = document.createElement('div');
            big.className = 'auto-big-watermark';
            big.innerHTML = 'MOHNAD AL_KADRI';
            document.body.appendChild(big);
            
            setTimeout(() => {
                if (big.parentNode) big.remove();
            }, 2000);
        }
        
        // ========== 7. نظام التحذيرات ==========
        function showWarning(message) {
            const oldWarning = document.querySelector('.auto-warning');
            if (oldWarning) oldWarning.remove();
            
            const warning = document.createElement('div');
            warning.className = 'auto-warning';
            warning.textContent = message;
            document.body.appendChild(warning);
            
            setTimeout(() => {
                warning.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                warning.classList.remove('show');
                setTimeout(() => {
                    if (warning.parentNode) warning.remove();
                }, 500);
            }, 2000);
        }
        
        // ========== 8. منع محاولة تصوير الشاشة عبر تغير الاتجاه ==========
        function preventOrientationScreenshot() {
            let lastOrientation = window.orientation;
            let changeCount = 0;
            
            window.addEventListener('orientationchange', function() {
                changeCount++;
                
                if (changeCount > 2) {
                    showWarning('⚠️ حركة غير طبيعية');
                    addBigWatermark();
                    changeCount = 0;
                }
                
                setTimeout(() => {
                    changeCount = 0;
                }, 5000);
            });
        }
        
        // ========== 9. منع النسخ واللصق ==========
        function preventCopyPaste() {
            document.addEventListener('copy', function(e) {
                e.preventDefault();
                showWarning('❌ النسخ غير مسموح');
            });
            
            document.addEventListener('cut', function(e) {
                e.preventDefault();
                showWarning('❌ القص غير مسموح');
            });
            
            document.addEventListener('paste', function(e) {
                e.preventDefault();
                showWarning('❌ اللصق غير مسموح');
            });
        }
        
        // ========== 10. منع حفظ الصور من الصفحة ==========
        function preventImageSave() {
            document.querySelectorAll('img').forEach(function(img) {
                img.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    showWarning('❌ لا يمكن حفظ الصور');
                });
                
                img.addEventListener('dragstart', function(e) {
                    e.preventDefault();
                });
            });
        }
        
        // ========== بدء تشغيل الحماية ==========
        function startProtection() {
            console.log('✅ نظام الحماية التلقائي يعمل');
            
            preventScreenshot();
            preventLongTouch();
            preventContextMenu();
            preventPageLeave();
            addWatermarks();
            preventOrientationScreenshot();
            preventCopyPaste();
            preventImageSave();
            
            // رسالة في الكونسول
            console.log('%c👤 MOHNAD AL_KADRI - 19 SYRIA', 'color: #007BFF; font-size: 16px;');
            console.log('%c🔒 هذا الموقع محمي تلقائياً', 'color: #FFD700; font-size: 14px;');
            
            // تنبيه ترحيبي
            setTimeout(() => {
                showWarning('🔒 الموقع محمي');
            }, 1500);
        }
        
        // تشغيل الحماية
        startProtection();
    });
})();document.titl
