console.log("Hello from content.js");
function createAIButton(){
    const button = document.createElement('div');
    button.className = 'T-I J-J5-Ji aoO v7 T-I-atl L3';
    button.style.marginRight = '8px';
    button.style.cursor = 'pointer';
    button.innerHTML = "AI-Reply";
    button.setAttribute('role', 'button');
    button.setAttribute('data-tooltip', 'Generate Reply');
    return button;
   

}
function getEmailContent(){
    const selectors = [ '.h7', '.a3S.aiL', '[role="presentation"]','.gmail_quote' ];
    for(const selector of selectors){               
        const content = document.querySelector(selector);
        if(content){
           return content.innerText.trim();
        }
        return "";
    }   

}
function findComposeToolbar(){
    const selectors = [ '.aDh', '.btC', '[role="toolbar"]','.gU.Up' ];
    for(const selector of selectors){               
        const toolbar = document.querySelector(selector);
        if(toolbar){
           return toolbar;
        }
        return null;
    }   

}
function injectButton() {
    const existingButton = document.querySelector('.ai-reply-button');
    if (existingButton) existingButton.remove();

    const toolbar = findComposeToolbar();
    if (!toolbar) {
        console.log('Toolbar not found');
        return;
    }

    console.log('Toolbar found, creating button');

    const button = createAIButton();
    button.classList.add('ai-reply-button');

    // Apply correct Gmail button styling
    button.style.marginLeft = '8px'; // Space from Reply button
    button.style.padding = '8px 16px'; // Similar padding to Gmail buttons
    button.style.fontSize = '14px';
    button.style.borderRadius = '4px';
    button.style.border = '1px solid rgba(0, 0, 0, 0.1)';
    button.style.backgroundColor = '#4285F4'; // Google blue color
    button.style.color = 'white';
    button.style.fontWeight = 'bold';

    button.addEventListener('click', async () => {
        console.log('Button clicked');
        try {
            button.innerHTML = 'Generating...';
            button.ariaDisabled = true;

            const emailContent = getEmailContent();
            const response = await fetch('http://localhost:8080/api/email/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    emailContent: emailContent,
                    tone: "Professional"
                })
            });

            if (!response.ok) {
                throw new Error('Failed to generate API reply');
            }

            const generatedReply = await response.text();
            const composeBox = document.querySelector('[role="textbox"][g_editable="true"]');
            if (composeBox) {
                composeBox.focus();
                document.execCommand('insertText', false, generatedReply);
            } else {
                console.log('Compose box not found');
            }
        } catch (err) {
            console.log(err);
            alert("Failed to generate the reply");
        } finally {
            button.innerHTML = 'AI-Reply';
            button.disabled = false;
        }
    });

    // Insert AI-Reply button **next to the Reply button**
    const replyButton = toolbar.querySelector('.T-I.J-J5-Ji'); // Find existing Gmail reply button
    if (replyButton) {
        replyButton.insertAdjacentElement('afterend', button); // Place AI button after Reply button
    } else {
        toolbar.insertBefore(button, toolbar.firstChild); // Fallback: Insert at start of toolbar
    }
}

// Create a MutationObserver
const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
        const addedNodes = Array.from(mutation.addedNodes);

       

        const hasComposedElements = addedNodes.some(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              
                return (
                    node.matches('.aDh,.btC,[role="dialog"]') || 
                    (node instanceof Element && node.querySelector('.aDh,.btC,[role="dialog"]'))
                );
            }
            return false;
        });

        if (hasComposedElements) {
            console.log('Compose element detected');
            setTimeout(injectButton, 500);
        }
    }
});

// Start observing changes in the DOM
observer.observe(document.body, {
    childList: true,
    subtree: true
});