# Scroll Animations Documentation

## Overview
The landing page features comprehensive **bidirectional scroll animations** that activate when elements come into view as users scroll **both up and down** the page. Elements animate in when entering the viewport and smoothly reverse when leaving.

## Implementation

### 1. Custom Hook: `useScrollAnimation.ts`
Located in `src/hooks/useScrollAnimation.ts`
- Uses Intersection Observer API to detect when elements enter viewport
- Configurable threshold, root margin, and trigger-once options
- Returns element ref and visibility state

### 2. ScrollReveal Component
Located in `src/components/ScrollReveal.tsx`
- Wrapper component that applies scroll animations to children
- Supports multiple animation types
- Configurable delay for staggered animations
- **Bidirectional support**: Animates both when entering and leaving viewport
- Optional `triggerOnce` prop for one-time animations
- Smooth CSS transitions instead of keyframe animations for reversibility

### 3. Animation Types

#### Available Animations:
1. **reveal** - Fade in from bottom with upward motion
2. **fade-in** - Simple opacity fade
3. **slide-left** - Slide in from left side
4. **slide-right** - Slide in from right side
5. **zoom-in** - Scale up from 80% to 100%
6. **flip-in** - 3D flip effect from top

### 4. CSS Classes (in `index.css`)

#### Transition-Based Animations:
All animations now use CSS transitions instead of keyframes for smooth bidirectional behavior:

- `.scroll-reveal` - Starts at `opacity: 0, translateY(50px)`
  - `.is-visible` → `opacity: 1, translateY(0)`
  
- `.scroll-fade-in` - Starts at `opacity: 0`
  - `.is-visible` → `opacity: 1`
  
- `.scroll-slide-left` - Starts at `opacity: 0, translateX(-100px)`
  - `.is-visible` → `opacity: 1, translateX(0)`
  
- `.scroll-slide-right` - Starts at `opacity: 0, translateX(100px)`
  - `.is-visible` → `opacity: 1, translateX(0)`
  
- `.scroll-zoom-in` - Starts at `opacity: 0, scale(0.8)`
  - `.is-visible` → `opacity: 1, scale(1)`
  
- `.scroll-flip-in` - Starts at `opacity: 0, rotateX(-90deg)`
  - `.is-visible` → `opacity: 1, rotateX(0)`

**Key Feature**: When `.is-visible` is removed, elements smoothly transition back to their initial state!

## Usage Examples

### Basic Usage:
```tsx
<ScrollReveal animation="reveal">
  <div>Your content here</div>
</ScrollReveal>
```

### With Delay (Staggered):
```tsx
{items.map((item, index) => (
  <ScrollReveal 
    key={item.id}
    animation="zoom-in"
    delay={index * 100}
  >
    <Card>{item.content}</Card>
  </ScrollReveal>
))}
```

### Alternating Animations:
```tsx
{items.map((item, index) => (
  <ScrollReveal 
    animation={index % 2 === 0 ? "slide-left" : "slide-right"}
    delay={index * 150}
  >
    <Card>{item.content}</Card>
  </ScrollReveal>
))}
```

## Landing Page Implementation

### Features Section:
- **Header**: Zoom-in animation
- **Feature Cards**: Reveal animation with 100ms stagger

### Stats Section:
- **All Cards**: Zoom-in animation with 150ms stagger

### Testimonials Section:
- **Header**: Fade-in animation
- **Cards**: Alternating slide-left/slide-right with 150ms stagger

### CTA Section:
- **Entire Card**: Flip-in 3D animation

## Bidirectional Animation Behavior

### Default Behavior (triggerOnce=false):
- ✅ Animates when scrolling **down** (element enters viewport)
- ✅ Reverses when scrolling **up** (element leaves viewport)
- ✅ Re-animates when scrolling back down
- ✅ Smooth transitions in both directions

### One-Time Animation (triggerOnce=true):
- ✅ Animates once on first appearance
- ✅ Stays visible permanently
- ✅ Better for hero sections or important content

## Performance Considerations

1. **Bidirectional Support**: Elements can animate multiple times as you scroll
2. **Smooth Transitions**: CSS transitions (not keyframes) for reversibility
3. **Threshold**: Set to 0.1 (10% visibility) for early triggering
4. **Root Margin**: -100px bottom margin for better timing
5. **Timeout Management**: Clears pending animations to prevent conflicts

## Browser Support

- Modern browsers with Intersection Observer API support
- Graceful degradation: Elements remain visible if API unavailable
- CSS animations supported in all modern browsers

## Customization

### Adjust Animation Duration:
Edit the animation duration in `index.css`:
```css
.scroll-reveal.is-visible {
  animation: scroll-reveal 0.8s ease-out forwards;
  /* Change 0.8s to your preferred duration */
}
```

### Adjust Threshold:
Modify the threshold in `ScrollReveal.tsx`:
```tsx
{ threshold: 0.1 } // Change to 0.2 for 20% visibility required
```

### Add New Animation:
1. Add keyframe in `index.css`
2. Add class with `.is-visible` trigger
3. Add animation type to `ScrollReveal` component

## Testing

### Scroll Down (Forward):
- ✅ Features section zooms in
- ✅ Feature cards reveal from bottom with stagger
- ✅ Stats zoom in sequentially
- ✅ Testimonials slide from alternating sides
- ✅ CTA flips in with 3D effect

### Scroll Up (Backward):
- ✅ Elements fade out and move back to initial positions
- ✅ Smooth reverse transitions
- ✅ Ready to re-animate when scrolling down again

### Test Instructions:
1. **Refresh the page**
2. **Scroll down slowly** - Watch elements animate in
3. **Scroll back up** - Watch elements smoothly reverse
4. **Scroll down again** - Elements re-animate!
5. **Try fast scrolling** - Animations still smooth and responsive
