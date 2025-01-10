#import <ApplicationServices/ApplicationServices.h>
#import <CoreGraphics/CoreGraphics.h>
#import <signal.h>

static CFMachPortRef eventTap = NULL;
static CGPoint lastPoint = {0, 0};

void cleanup() {
    if (eventTap) {
        CGEventTapEnable(eventTap, false);
        CFRelease(eventTap);
        eventTap = NULL;
    }
    printf("Mouse lock disabled\n");
    fflush(stdout);
}

void signal_handler(int signum) {
    cleanup();
    exit(0);
}

static CGEventRef eventCallback(CGEventTapProxy proxy, CGEventType type, CGEventRef event, void *userInfo) {
    if (type == kCGEventMouseMoved) {
        // Log the current mouse position
        CGPoint point = CGEventGetLocation(event);
        printf("Mouse moved to x=%f, y=%f\n", point.x, point.y);
        fflush(stdout);

        // Warp the cursor back to the last known position
        CGWarpMouseCursorPosition(lastPoint);
        return NULL;
    }
    
    if (type == kCGEventKeyDown) {
        // Check if the Escape key is pressed
        CGKeyCode keyCode = (CGKeyCode)CGEventGetIntegerValueField(event, kCGKeyboardEventKeycode);
        if (keyCode == 53) { // 53 is the keycode for Escape
            printf("Escape key pressed, disabling mouse lock\n");
            fflush(stdout);
            cleanup();
            CFRunLoopStop(CFRunLoopGetCurrent()); // Stop the run loop
            exit(0); // Ensure the process exits
        }
    }
    
    // Allow all other events to pass through unchanged
    return event;
}

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        // Set up signal handlers
        signal(SIGTERM, signal_handler);
        signal(SIGINT, signal_handler);
        
        // Get initial cursor position
        CGEventRef currentEvent = CGEventCreate(NULL);
        lastPoint = CGEventGetLocation(currentEvent);
        CFRelease(currentEvent);
        
        // Create event tap
        eventTap = CGEventTapCreate(
            kCGSessionEventTap,
            kCGHeadInsertEventTap,
            kCGEventTapOptionDefault,
            CGEventMaskBit(kCGEventMouseMoved),
            eventCallback,
            NULL
        );

        if (!eventTap) {
            fprintf(stderr, "Failed to create event tap\n");
            return 1;
        }

        // Create a run loop source
        CFRunLoopSourceRef runLoopSource = CFMachPortCreateRunLoopSource(
            kCFAllocatorDefault,
            eventTap,
            0
        );

        // Add to the current run loop
        CFRunLoopAddSource(
            CFRunLoopGetCurrent(),
            runLoopSource,
            kCFRunLoopCommonModes
        );

        // Enable the event tap
        CGEventTapEnable(eventTap, true);

        printf("Mouse lock enabled at x=%f, y=%f\n", lastPoint.x, lastPoint.y);
        fflush(stdout);

        // Run the loop
        CFRunLoopRun();

        // Cleanup
        cleanup();
        if (runLoopSource) {
            CFRelease(runLoopSource);
        }
    }
    return 0;
}
