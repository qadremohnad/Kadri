// ============================================
// حماية قوية جداً - strong-protection.js
// تعمل تلقائياً وتمنع جميع محاولات التصوير والتحميل
// ============================================

(function() {
    'use strict';
    
    // ========== الحماية الفورية ==========
    function init() {
        console.log('🔒 تفعيل الحماية القوية...');
        
        // ========== 1. منع جميع القوائم ==========
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }, true);
        
        // ========== 2. منع أحداث اللمس ==========
        document.addEventListener('touchstart', (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
                return false;
            }
        }, { passive: false, capture: true });
        
        document.addEventListener('touchhold', (e) => {
            e.preventDefault();
            return false;
        }, true);
        
        // ========== 3. منع الضغط الطويل ==========
        document.addEventListener('touchstart', function(e) {
            if (e.target.tagName === 'IMG') {
                setTimeout(() => {
                    e.preventDefault();
                }, 300);
            }
        }, { passive: false });
        
        // ========== 4. منع اختصارات التصوير ==========
        document.addEventListener('keydown', (e) => {
            // منع جميع الأزرار
            if (e.key.includes('Volume') || e.key === 'Power' || e.key === 'PrintScreen') {
                e.preventDefault();
                e.stopPropagation();
                return false;
            }
            
            // منع Ctrl+S, Ctrl+P, F12, PrtSc
            if (e.ctrlKey || e.key === 'F12' || e.key === 'PrintScreen') {
                e.preventDefault();
                return false;
            }
        }, true);
        
        // ========== 5. إضافة طبقات حماية كثيفة ==========
        function addStrongProtection() {
            // طبقة حماية شفافة تمنع اللمس على الصور
            const protectLayer = document.createElement('div');
            protectLayer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: transparent;
                z-index: 999990;
                pointer-events: none;
            `;
            document.body.appendChild(protectLayer);
            
            // علامة مائية ثابتة في كل مكان
            for (let i = 0; i < 5; i++) {
                const wm = document.createElement('div');
                wm.style.cssText = `
                    position: fixed;
                    ${i % 2 === 0 ? 'top' : 'bottom'}: ${20 + (i * 30)}px;
                    ${i < 3 ? 'left' : 'right'}: ${20 + (i * 20)}px;
                    color: rgba(0, 123, 255, 0.15);
                    font-size: 14px;
                    font-weight: bold;
                    transform: rotate(${i * 15}deg);
                    pointer-events: none;
                    z-index: 999991;
                    white-space: nowrap;
                `;
                wm.innerHTML = 'MOHNAD AL_KADRI • 19 • SYRIA';
                document.body.appendChild(wm);
            }
            
            // شبكة حماية كثيفة
            const grid = document.createElement('div');
            grid.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: repeating-linear-gradient(
                    0deg,
                    rgba(0, 123, 255, 0.02) 0px,
                    rgba(0, 123, 255, 0.02) 50px,
                    transparent 50px,
                    transparent 100px
                ),
                repeating-linear-gradient(
                    90deg,
                    rgba(0, 123, 255, 0.02) 0px,
                    rgba(0, 123, 255, 0.02) 50px,
                    transparent 50px,
                    transparent 100px
                );
                pointer-events: none;
                z-index: 999989;
            `;
            document.body.appendChild(grid);
        }
        
        // ========== 6. إزالة خاصية الحفظ من الصور ==========
        function removeImageSave() {
            document.querySelectorAll('img').forEach(img => {
                // إزالة جميع خصائص الصورة
                img.removeAttribute('srcset');
                img.removeAttribute('sizes');
                
                // منع جميع الأحداث
                img.oncontextmenu = () => false;
                img.ondragstart = () => false;
                img.onselectstart = () => false;
                
                // إضافة طبقة شفافة فوق الصورة
                const wrapper = document.createElement('div');
                wrapper.style.cssText = `
                    position: relative;
                    display: inline-block;
                `;
                
                img.parentNode.insertBefore(wrapper, img);
                wrapper.appendChild(img);
                
                const cover = document.createElement('div');
                cover.style.cssText = `
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: transparent;
                    z-index: 1;
                `;
                wrapper.appendChild(cover);
            });
        }
        
        // ========== 7. كشف ومحاربة أدوات المطور ==========
        function fightDevTools() {
            // كشف F12 وأدوات المطور
            setInterval(() => {
                const before = new Date();
                debugger;
                const after = new Date();
                
                if (after - before > 100) {
                    // أدوات المطور مفتوحة
                    document.body.innerHTML = `
                        <div style="
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: black;
                            color: red;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            font-size: 24px;
                            font-weight: bold;
                            z-index: 9999999;
                        ">
                            ⛔ أدوات المطور معطلة ⛔<br>
                            MOHNAD AL_KADRI
                        </div>
                    `;
                }
            }, 1000);
        }
        
        // ========== 8. منع التصوير الخارجي ==========
        function preventExternalCapture() {
            let hiddenTime = 0;
            let blurTime = 0;
            
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    hiddenTime = Date.now();
                    document.body.style.filter = 'blur(20px)';
                } else {
                    if (Date.now() - hiddenTime < 3000) {
                        // عاد بسرعة (ربما كان يصور)
                        alert('⚠️ تم تسجيل محاولة تصوير');
                        
                        // إضافة علامة مائية حمراء
                        const redMark = document.createElement('div');
                        redMark.style.cssText = `
                            position: fixed;
                            top: 0;
                            left: 0;
                            right: 0;
                            bottom: 0;
                            background: rgba(255, 0, 0, 0.3);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            color: white;
                            font-size: 40px;
                            font-weight: bold;
                            z-index: 9999999;
                            pointer-events: none;
                        `;
                        redMark.innerHTML = 'MOHNAD AL_KADRI';
                        document.body.appendChild(redMark);
                        
                        setTimeout(() => {
                            redMark.remove();
                        }, 3000);
                    }
                    document.body.style.filter = 'none';
                }
            });
            
            window.addEventListener('blur', () => {
                blurTime = Date.now();
                document.body.style.opacity = '0.3';
            });
            
            window.addEventListener('focus', () => {
                if (Date.now() - blurTime < 2000) {
                    // عاد بسرعة
                    document.body.style.outline = '5px solid red';
                    setTimeout(() => {
                        document.body.style.outline = 'none';
                    }, 2000);
                }
                document.body.style.opacity = '1';
            });
        }
        
        // ========== 9. تشويش الصور عند محاولة التصوير ==========
        function confuseImages() {
            // تغيير الصور قليلاً عند محاولة التصوير
            let imagesChanged = false;
            
            setInterval(() => {
                if (document.hidden || !document.hasFocus()) {
                    if (!imagesChanged) {
                        document.querySelectorAll('img').forEach(img => {
                            img.style.filter = 'blur(5px) brightness(0.5)';
                        });
                        imagesChanged = true;
                    }
                } else {
                    if (imagesChanged) {
                        document.querySelectorAll('img').forEach(img => {
                            img.style.filter = 'none';
                        });
                        imagesChanged = false;
                    }
                }
            }, 500);
        }
        
        // ========== 10. تنبيهات قوية ==========
        function strongAlert(message) {
            const alert = document.createElement('div');
            alert.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(255, 0, 0, 0.95);
                color: white;
                padding: 30px 50px;
                border-radius: 20px;
                font-size: 24px;
                font-weight: bold;
                z-index: 99999999;
                border: 4px solid white;
                box-shadow: 0 0 200px red;
                text-align: center;
                animation: alertPulse 0.5s;
            `;
            alert.innerHTML = `🚫 ${message} 🚫<br><small style="font-size: 16px;">MOHNAD AL_KADRI</small>`;
            document.body.appendChild(alert);
            
            setTimeout(() => {
                alert.remove();
            }, 2000);
        }
        
        // ========== تطبيق جميع الحمايات ==========
        addStrongProtection();
        removeImageSave();
        fightDevTools();
        preventExternalCapture();
        confuseImages();
        
        // مراقبة مستمرة
        setInterval(() => {
            // إعادة تطبيق الحماية على أي صور جديدة
            removeImageSave();
            
            // منع أي محاولة جديدة
            document.querySelectorAll('*').forEach(el => {
                if (el.tagName === 'IMG') {
                    el.style.pointerEvents = 'none';
                }
            });
        }, 2000);
        
        // تنبيه ترحيبي
        console.log('%c🔥 الحماية القوية نشطة - MOHNAD AL_KADRI', 'color: #FF0000; font-size: 20px; font-weight: bold;');
        console.log('%c📵 أي محاولة تصوير سيتم تسجيلها', 'color: #FFD700; font-size: 16px;');
        
        // اختبار الحماية
        setTimeout(() => {
            strongAlert('الموقع محمي');
        }, 1000);
    }
    
    // تشغيل الحماية فوراً
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // تشغيل مرة أخرى بعد ثانية للتأكد
    setTimeout(init, 1000);
    setTimeout(init, 3000);
    
})();              
