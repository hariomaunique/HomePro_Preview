# HomePro Animated Splash Screen - Kotlin & Jetpack Compose Guide

Yeh guide aapke Android (Kotlin) app me **HomePro Splash Screen** ko pixel-perfect aur smooth animation ke saath integrate karne ke liye banayi gayi hai.

---

## 1. Asset Setup (Android Resources)
Apne Android Studio project me images ko `res/drawable/` me place karein:
- `splash_screen_background.png` -> `res/drawable/splash_screen_background.png`
- `logo_without_ring.png` -> `res/drawable/logo_without_ring.png`
- `ring.png` -> `res/drawable/ring.png`
- `logo_text.png` -> `res/drawable/logo_text.png`

---

## 2. Jetpack Compose Implementation

Agar aapka app **Jetpack Compose** use kar raha hai, to yeh single-file Composable use karein:

```kotlin
package com.homepro.app.presentation.splash

import androidx.compose.animation.core.*
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.graphics.*
import androidx.compose.ui.graphics.drawscope.clipPath
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import com.homepro.app.R
import kotlinx.coroutines.delay

@Composable
fun HomeProSplashScreen(
    onSplashFinished: () -> Unit = {}
) {
    // Controller for the animation sequence
    val transitionState = remember { MutableTransitionState(false) }
    
    LaunchedEffect(Unit) {
        transitionState.targetState = true
        // 2.5s delay to let the animation play fully before navigating to Home/Auth
        delay(2500)
        onSplashFinished()
    }

    val transition = updateTransition(transitionState, label = "HomeProSplashTransition")

    // Phase 1: House Entrance
    val houseAlpha by transition.animateFloat(
        transitionSpec = { tween(durationMillis = 500, easing = FastOutSlowInEasing) },
        label = "HouseAlpha"
    ) { state -> if (state) 1f else 0.5f }

    val houseScale by transition.animateFloat(
        transitionSpec = { tween(durationMillis = 600, easing = FastOutSlowInEasing) },
        label = "HouseScale"
    ) { state -> if (state) 1f else 0.94f }

    // Phase 2: Protective Ring Sweep (Bottom-Left to Top-Right)
    val ringProgress by transition.animateFloat(
        transitionSpec = {
            tween(
                durationMillis = 1400,
                delayMillis = 350,
                easing = FastOutSlowInEasing
            )
        },
        label = "RingProgress"
    ) { state -> if (state) 1f else 0f }

    // Phase 3: Text Wipe Reveal (Left to Right)
    val textProgress by transition.animateFloat(
        transitionSpec = {
            tween(
                durationMillis = 1100,
                delayMillis = 700,
                easing = CubicBezierEasing(0.25f, 0.1f, 0.25f, 1f)
            )
        },
        label = "TextProgress"
    ) { state -> if (state) 1f else 0f }

    // Phase 4: Bottom Loading Spinner Fade-in
    val loaderAlpha by transition.animateFloat(
        transitionSpec = {
            tween(durationMillis = 500, delayMillis = 1800)
        },
        label = "LoaderAlpha"
    ) { state -> if (state) 1f else 0f }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        // 1. Background Waves
        Image(
            painter = painterResource(id = R.drawable.splash_screen_background),
            contentDescription = null,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop
        )

        // 2. Main Content Stack
        Column(
            modifier = Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.weight(0.55f))

            // Logo Box (House + Ring overlay)
            Box(
                modifier = Modifier
                    .size(260.dp)
                    .graphicsLayer {
                        scaleX = houseScale
                        scaleY = houseScale
                        alpha = houseAlpha
                    },
                contentAlignment = Alignment.Center
            ) {
                // House Logo (without ring - already present)
                Image(
                    painter = painterResource(id = R.drawable.logo_without_ring),
                    contentDescription = "HomePro House",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Fit
                )

                // Protective Ring (Reveals along curve - Default Adjusted Position: +12dp Right, +2dp Down)
                Image(
                    painter = painterResource(id = R.drawable.ring),
                    contentDescription = "Protective Ring",
                    modifier = Modifier
                        .fillMaxSize()
                        .offset(x = 12.dp, y = 2.dp)
                        .drawWithContent {
                            val w = size.width
                            val h = size.height
                            
                            // Approximate the elliptical sweep from bottom-left (0.09, 0.67) to top-right (0.77, 0.26)
                            // Using clip rect or dynamic path:
                            val sweepAngle = ringProgress * 230f
                            val ringPath = Path().apply {
                                moveTo(w * 0.09f, h * 0.67f)
                                cubicTo(
                                    w * 0.13f, h * 0.75f,
                                    w * 0.26f, h * 0.75f,
                                    w * 0.38f, h * 0.71f
                                )
                                cubicTo(
                                    w * 0.54f, h * 0.65f,
                                    w * 0.75f, h * 0.58f,
                                    w * 0.83f, h * 0.46f
                                )
                                cubicTo(
                                    w * 0.89f, h * 0.38f,
                                    w * 0.85f, h * 0.28f,
                                    w * 0.77f, h * 0.26f
                                )
                            }
                            
                            // Hardware accelerated clip
                            clipRect(
                                left = 0f,
                                top = (1f - ringProgress) * h * 0.5f,
                                right = size.width * Math.min(1f, ringProgress * 1.3f),
                                bottom = size.height
                            ) {
                                this@drawWithContent.drawContent()
                            }
                        },
                    contentScale = ContentScale.Fit
                )
            }

            Spacer(modifier = Modifier.height(18.dp))

            // Brand Text: "HomePro" (Reveals from Left to Right)
            Box(
                modifier = Modifier
                    .width(260.dp)
                    .height(86.dp)
                    .drawWithContent {
                        clipRect(
                            left = 0f,
                            top = 0f,
                            right = size.width * textProgress,
                            bottom = size.height
                        ) {
                            this@drawWithContent.drawContent()
                        }
                    }
            ) {
                Image(
                    painter = painterResource(id = R.drawable.logo_text),
                    contentDescription = "HomePro Text",
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Fit
                )
            }

            Spacer(modifier = Modifier.weight(0.45f))

            // Bottom Circular Loading Arc
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .graphicsLayer { alpha = loaderAlpha }
            ) {
                CircularProgressIndicator(
                    strokeWidth = 3.dp,
                    color = Color(0xFF0099FF),
                    modifier = Modifier.fillMaxSize()
                )
            }

            Spacer(modifier = Modifier.height(60.dp))
        }
    }
}
```

---

## 3. Standard Android Views (XML + ValueAnimator)

Agar aap traditional XML views use kar rahe hain:

```kotlin
// In SplashActivity.kt
class SplashActivity : AppCompatActivity() {

    private lateinit var binding: ActivitySplashBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)

        startProtectionAnimation()
    }

    private fun startProtectionAnimation() {
        // 1. Ring Sweep Animator
        val ringAnimator = ValueAnimator.ofFloat(0f, 1f).apply {
            duration = 1400
            startDelay = 350
            interpolator = FastOutSlowInInterpolator()
            addUpdateListener { animator ->
                val progress = animator.animatedValue as Float
                // Update ring clip or custom drawable
            }
        }

        // 2. Text Reveal (Left to Right clip-bounds)
        val textAnimator = ValueAnimator.ofFloat(0f, 1f).apply {
            duration = 1100
            startDelay = 700
            interpolator = AccelerateDecelerateInterpolator()
            addUpdateListener { animator ->
                val progress = animator.animatedValue as Float
                val w = binding.imgLogoText.width
                val h = binding.imgLogoText.height
                binding.imgLogoText.clipBounds = Rect(0, 0, (w * progress).toInt(), h)
            }
        }

        // 3. Loader fade in
        binding.progressBar.alpha = 0f
        binding.progressBar.animate()
            .alpha(1f)
            .setStartDelay(1800)
            .setDuration(500)
            .start()

        ringAnimator.start()
        textAnimator.start()
    }
}
```
