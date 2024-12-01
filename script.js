const clipboardButton = `
<span class="social-clipboard-button" focusable="true" tabindex="0" role="button" aria-label="Copy to clipboard" >
    <svg fill="#17d8ff" xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 52 52"
        enable-background="new 0 0 52 52" xml:space="preserve">
        <path
            d="M44,2H18c-2.2,0-4,1.8-4,4v2h24c2.2,0,4,1.8,4,4v28h2c2.2,0,4-1.8,4-4V6C48,3.8,46.2,2,44,2z" />
        <path
            d="M38,16c0-2.2-1.8-4-4-4H8c-2.2,0-4,1.8-4,4v30c0,2.2,1.8,4,4,4h26c2.2,0,4-1.8,4-4V16z M20,23
        c0,0.6-0.4,1-1,1h-8c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h8c0.6,0,1,0.4,1,1V23z M28,39c0,0.6-0.4,1-1,1H11c-0.6,0-1-0.4-1-1v-2
        c0-0.6,0.4-1,1-1h16c0.6,0,1,0.4,1,1V39z M32,31c0,0.6-0.4,1-1,1H11c-0.6,0-1-0.4-1-1v-2c0-0.6,0.4-1,1-1h20c0.6,0,1,0.4,1,1V31z" />
    </svg>
</span>
`;
let nodesToRemove = [];
class ClickableElement extends HTMLElement {
    constructor() {
        super();
        const style = document.createElement('style');
        this.setAttribute('role', 'button');
        style.textContent = /*css*/`
            @keyframes slide-from-right {
                from{
                    left: 120px;
                    opacity: 0;
                }
                to{
                    left: 70px;
                    opacity: 1;
                }
            }
            :host{
                --mobile-font-size: 1rem;
                --desktop-font-size: 1.2rem;
                --current-font-size: var(--mobile-font-size);
                display: flex;
                color: aqua;
                position: relative;
                
                .social-button-text{
                    min-width: 100%;
                    padding-block: 20px;
                    text-decoration: none;                    
                    color: aqua;
                    user-select: none;                           
                }
                text-align: center;
                outline: aqua 1px solid;
                font-size: var(--current-font-size);
                font-weight: bold;
                justify-content: center;
                width: var(--links-width-size);
                background-color: rgba(0, 0, 0, 0.856);                
                border-radius: 40px;
                transition: background-color 0.3s ease,
                    width 0.2s ease;
                span{
                    position: absolute;
                    right: 50px;
                    top: 20px;
                    z-index: 50;
                    padding-inline: 20px;        
                    &:hover, &:focus{
                        cursor: pointer;
                        svg{fill: white;}
                        @media screen and (width > 500px) {
                            &:after{
                                content: "Copy to clipboard";
                                position: absolute;
                                background-color: #17d8ff;
                                padding-inline: 10px;
                                padding-block: 10px;
                                border-radius: 10px;
                                color: white;
                                outline: white solid 2px;   
                                box-shadow: 0px 0px 10px 1px black;
                                animation: slide-from-right 0.3s ease forwards;
                                top: -40px;
                            }
                        }       
                    }      
                    @media screen and (width < 1000px) {
                        right: 10px;
                    }        
                } 
            }
            :host(:hover),
            :host(:focus){
                .social-button-text{color: white;}               
                background-color: #17d8ff;
                box-shadow: 0px 0px 20px 4px #17d8ff;
                cursor:default;                                 
                svg{fill: black;}
            } 
        `

        const shadow = this.attachShadow({ mode: 'open' });
        
        const innerChildren = `
        <a class="social-button-text" type="button" target="_blank" href="${this.dataset.link}" tabindex="-1">${this.dataset.content}</a>
        ${clipboardButton}`
        const innerElems = document.createElement('template');
        innerElems.innerHTML = innerChildren;
        shadow.appendChild(innerElems.content.cloneNode(true));
        shadow.appendChild(style);
        this.aTag = shadow.querySelector('a');
        this.span = shadow.querySelector('span');
        this.span.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') e.target.click();         
            e.stopPropagation();   
        });

        this.addEventListener('keydown', this.keyPressed.bind(this));

    }
    keyPressed(e){
        if(e.key === 'Enter') this.aTag.click();
        if(e.key === 'Escape') e.target.blur();
    }
    
    connectedCallback() {
        
        this.span.addEventListener('click', (e) => {            
            navigator.clipboard.writeText(this.aTag.href).then(() => {
                const notif = document.createElement('notification-message');
                nodesToRemove.push(notif);
                document.body.appendChild(notif);
                notif.disappearTimer();   
                console.log(`Copied link to clipboard`);
            }).catch(err=>{console.log(err);});        
        });        
    }
}
class NotificationMessage extends HTMLElement {
    constructor() {
        super();
        const spanElem = `<span>Link copied to clipboard</span>`;
        const spanTemplate = document.createElement('template');
        spanTemplate.innerHTML = spanElem;
       
        const style = document.createElement('style'); 
        style.textContent = /*css*/`
            @keyframes slide-up{
                from{ bottom: -100%;}
                to{ bottom: 80px; }
            }
            :host{
                display: flex;
                position: fixed;
                bottom: 20px;
                background-color: grey;
                padding-inline: 20px;
                padding-block: 10px;
                width: max-content;
                right: 50%;
                left: 50%;
                translate: -50%;
                color: white;
                outline: darkgrey solid 2px;
                border-radius: 20px;
                animation: slide-up 0.4s ease forwards;
                z-index: 110;
                span{
                    font-size: 1.2rem;
                    color: white; font-weight: bold;
                }
            }`
        const shadow = this.attachShadow({ mode: 'open' });
        shadow.appendChild(spanTemplate.content.cloneNode(true));
        shadow.appendChild(style);        
    }
    disappearTimer(){
        return setTimeout(() => {
            const nodeToRemove = nodesToRemove.filter(node => node === this)
            this.parentNode.removeChild(nodeToRemove[0]);
            nodesToRemove = nodesToRemove.filter(node => node !== this);
            console.log(nodesToRemove)
        }, 1500);
    }    
}

customElements.define('social-media-button', ClickableElement);
customElements.define('notification-message', NotificationMessage);