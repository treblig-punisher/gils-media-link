// const regularLinkContainers = document.querySelectorAll('.regular-links');    
// const links = document.querySelectorAll('.regular-links > a ');
const clipboardButton = `
<span focusable="true" tabindex="0">
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


// regularLinkContainers.forEach(element => {
//     element.insertAdjacentHTML('beforeend', clipboardButton)
// })
// const buttons =  document.querySelectorAll('.regular-links > span'); 
// buttons.forEach((element, index) => {
//     const parentLink = links[index].href;
    
//     element.addEventListener('click', (e) => {            
//         e.stopPropagation();
        
//         navigator.clipboard.writeText(parentLink).then(() => {
//             console.log(`Copied link to clipboard`);
//         }).catch(err=>{
//             console.log(err);});
//     });
// });


    

class ClickableElement extends HTMLElement {
    constructor() {
        super();
        const style = document.createElement('style');
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
                color: aqua;
                display: block;
                position: relative;
                a{
                    display: inline-block;
                    min-width: 100%;
                    min-height: 100%;
                    text-decoration: none;
                    color: aqua;
                    user-select: none;        
                }
                text-align: center;
                outline: aqua 1px solid;
                font-size: var(--current-font-size);
                font-weight: bold;
                justify-content: center;
                padding: 20px 0px;
                width: var(--links-width-size);
                background-color: rgba(0, 0, 0, 0.856);                
                border-radius: 40px;
                transition: background-color 0.3s ease,
                    width 0.2s ease;
                span{
                    position: absolute;
                    right: 50px;
                    z-index: 50;
                    padding-inline: 20px;        
                    &:hover{
                        cursor: pointer;     
                        &:after{
                            content: "Copy to clipboard";
                            position: absolute;
                            background-color: #17d8ff;
                            padding-inline: 10px;
                            padding-block: 10px;
                            border-radius: 10px;
                            color: white;
                            outline: white solid 2px;
                            /* left: 70px; */
                            animation: slide-from-right 0.3s ease forwards;
                            top: -40px;
                        }       
                    }      
                    @media screen and (width < 1000px) {
                        right: 10px;
                    }        
                }        
                &:hover,
                &:focus{
                    background-color: #17d8ff;
                    box-shadow: 0px 0px 20px 4px #17d8ff;
                    &:not(span:hover){
                        // background-color: #17d8ff;
                        // box-shadow: 0px 0px 20px 4px #17d8ff;
                        cursor:default;
                        a{color: white;}
                    }                
                    svg{fill: white;}
                    color: white;       
                }    
            }
            // :host(:hover),
            // :host(:focus) {
            //     &:not(span:hover){
            //         background-color: #17d8ff;
            //         box-shadow: 0px 0px 20px 4px #17d8ff;
            //         cursor:default;
            //         a{color: white;}
            //     }                
            //     svg{fill: white;}
            //     color: white;
            // } 
        `

        const shadow = this.attachShadow({ mode: 'open' });
        
        
        const innerChildren = `
        <a type="button" target="_blank" href="${this.dataset.link}" focusable="false">${this.dataset.content}</a>
        ${clipboardButton}`
        const innerElems = document.createElement('template');
        innerElems.innerHTML = innerChildren;
        shadow.appendChild(innerElems.content.cloneNode(true));
        shadow.appendChild(style);
        this.aTag = shadow.querySelector('a');
        this.span = shadow.querySelector('span');
        this.span.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') this.span.click();
        });

    }
    connectedCallback() {
        this.span.addEventListener('click', (e) => {
            navigator.clipboard.writeText(this.aTag.href).then(() => {
                console.log(`Copied link to clipboard`);
            }).catch(err=>{console.log(err);});        
        });
        
    }
}

customElements.define('social-media-button', ClickableElement);