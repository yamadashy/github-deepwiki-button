import '../styles/content.css';

export default defineContentScript({
  matches: ['https://github.com/*'],
  runAt: 'document_start',
  allFrames: true,

  main() {
    // Function to add DeepWiki button
    function addDeepWikiButton(): void {
      // If button already exists, do nothing
      if (document.querySelector('.deepwiki-button')) {
        return;
      }

      // Get repository main navigation element
      const navActions = document.querySelector<HTMLUListElement>('ul.pagehead-actions');
      if (!navActions) {
        return;
      }

      // Get repository information from current URL
      const pathMatch = window.location.pathname.match(/^\/([^/]+)\/([^/]+)/);
      if (!pathMatch) {
        return;
      }

      const [, owner, repo] = pathMatch;

      // Create DeepWiki button container
      const container = document.createElement('li');
      container.className = 'deepwiki-container';

      // Create BtnGroup container
      const btnGroup = document.createElement('div');
      btnGroup.setAttribute('data-view-component', 'true');
      btnGroup.className = 'BtnGroup';

      // Create button
      const button = document.createElement('a');
      button.className = 'btn-sm btn BtnGroup-item deepwiki-button';
      button.href = `https://deepwiki.com/${owner}/${repo}`;
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
      button.setAttribute('data-view-component', 'true');

      // Add icon
      const icon = document.createElement('span');
      icon.className = 'octicon';
      icon.innerHTML = `
        <img src="${browser.runtime.getURL('images/icon-64.png' as any)}" width="16" height="16" alt="DeepWiki">
      `;

      // Add text
      const text = document.createTextNode('DeepWiki');
      button.appendChild(icon);
      button.appendChild(text);
      btnGroup.appendChild(button);
      container.appendChild(btnGroup);

      // Add to navigation
      navActions.insertBefore(container, navActions.firstChild);
    }

    // Execute immediately and on DOMContentLoaded
    addDeepWikiButton();
    document.addEventListener('DOMContentLoaded', () => {
      addDeepWikiButton();

      // Handle GitHub SPA navigation
      let lastUrl = location.href;
      let isProcessing = false;

      const observer = new MutationObserver((mutations: MutationRecord[]) => {
        if (isProcessing) return;
        isProcessing = true;

        const url = location.href;
        if (url !== lastUrl) {
          lastUrl = url;
          setTimeout(() => {
            addDeepWikiButton();
            isProcessing = false;
          }, 500);
          return;
        }

        // Monitor navigation element addition (only if button doesn't exist)
        const navActions = document.querySelector<HTMLUListElement>('ul.pagehead-actions');
        const deepWikiButton = document.querySelector('.deepwiki-button');
        if (navActions && !deepWikiButton) {
          addDeepWikiButton();
        }

        isProcessing = false;
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false,
      });
    });
  },
});
