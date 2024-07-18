document.addEventListener('DOMContentLoaded', () => {
    const elementIds = [
      'bold-btn', 'italic-btn', 'underline-btn', 'strike-btn', 'align-left-btn', 'align-center-btn', 'align-right-btn', 
      'justify-btn', 'bullet-list-btn', 'number-list-btn', 'undo-btn', 'redo-btn', 'font-select', 'font-size-select', 
      'custom-font-size', 'color-input', 'highlight-input', 'save-btn', 'load-btn', 'insert-table-btn', 'insert-image-btn', 
      'find-btn', 'replace-btn', 'name-input', 'link-btn', 'new-btn', 'open-btn', 'make-copy-btn', 'share-btn', 'email-btn', 
      'download-html-btn', 'download-txt-btn', 'download-pdf-btn', 'download-docx-btn', 'page-setup-btn', 'print-btn', 'cut-btn', 
      'copy-btn', 'paste-btn', 'select-all-btn', 'superscript-btn', 'subscript-btn', 'capitalization-btn', 'insert-dropdown-btn', 
      'insert-emoji-btn', 'edit-mode-btn', 'view-mode-btn'
    ];
    const elements = {};
    elementIds.forEach(id => {
      elements[id] = document.getElementById(id);
    });

    const editor = document.getElementById('editor');
    let hasUnsavedChanges = false;
    let fileName = '';

    editor.addEventListener('input', () => {
      hasUnsavedChanges = true;
    });

    elements['save-btn'].addEventListener('click', () => {
      const text = editor.innerHTML;
      const name = elements['name-input'].value.trim();

      if (!name) {
        const promptName = prompt('Enter a name for your file:');
        if (promptName) {
          elements['name-input'].value = promptName;
          fileName = promptName;
        } else {
          return; // Cancel save if no name is entered
        }
      } else {
        fileName = name;
      }

      const blob = new Blob([text], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.html`;
      a.click();

      hasUnsavedChanges = false;
      document.title = fileName; // Update title with file name
    });

    window.addEventListener('beforeunload', (e) => {
      if (hasUnsavedChanges) {
        const confirmationMessage = 'You have unsaved changes. Do you really want to leave?';
        (e || window.event).returnValue = confirmationMessage; // For most browsers
        return confirmationMessage; // For some browsers
      }
    });

    elements['new-btn'].addEventListener('click', () => {
      if (confirm('Do you want to create a new document? Unsaved changes will be lost.')) {
        editor.innerHTML = '';
        elements['name-input'].value = '';
        document.title = 'New Document';
      }
    });

    elements['open-btn'].addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.html';
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          editor.innerHTML = text;
          fileName = file.name.split('.').slice(0, -1).join('.');
          elements['name-input'].value = fileName;
          document.title = fileName;
        };
        reader.readAsText(file);
      };
      input.click();
    });

    elements['make-copy-btn'].addEventListener('click', () => {
      navigator.clipboard.writeText(editor.innerHTML);
      alert('Document copied to clipboard.');
    });

    elements['share-btn'].addEventListener('click', () => {
      alert('Sharing functionality not implemented yet.');
    });

    elements['email-btn'].addEventListener('click', () => {
      const email = prompt('Enter recipient email:');
      const subject = prompt('Enter email subject:');
      const body = editor.innerHTML;
      if (email && subject && body) {
        const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.location.href = mailtoLink;
      }
    });

    elements['download-html-btn'].addEventListener('click', () => {
      const text = editor.innerHTML;
      const name = elements['name-input'].value || 'document';
      const blob = new Blob([text], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.html`;
      a.click();
    });

    elements['download-txt-btn'].addEventListener('click', () => {
      const text = editor.innerText;
      const name = elements['name-input'].value || 'document';
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${name}.txt`;
      a.click();
    });

    elements['download-pdf-btn'].addEventListener('click', () => {
      const text = editor.innerHTML;
      const name = elements['name-input'].value || 'document';
      const docDefinition = { content: [{ html: text }] };
      pdfMake.createPdf(docDefinition).download(`${name}.pdf`);
    });

    elements['download-docx-btn'].addEventListener('click', () => {
      const text = editor.innerHTML;
      const name = elements['name-input'].value || 'document';
      const zip = new JSZip();
      const doc = new Docxtemplater().loadZip(zip);
      doc.setData({ content: text });
      doc.render();
      const out = doc.getZip().generate({ type: 'blob' });
      saveAs(out, `${name}.docx`);
    });

    elements['page-setup-btn'].addEventListener('click', () => {
      const marginTop = prompt('Enter top margin (mm):', '20');
      const marginRight = prompt('Enter right margin (mm):', '20');
      const marginBottom = prompt('Enter bottom margin (mm):', '20');
      const marginLeft = prompt('Enter left margin (mm):', '20');
      const pageWidth = prompt('Enter page width (mm):', '210');
      const pageHeight = prompt('Enter page height (mm):', '297');
      editor.style.paddingTop = `${marginTop}mm`;
      editor.style.paddingRight = `${marginRight}mm`;
      editor.style.paddingBottom = `${marginBottom}mm`;
      editor.style.paddingLeft = `${marginLeft}mm`;
      editor.style.width = `${pageWidth}mm`;
      editor.style.height = `${pageHeight}mm`;
    });

    elements['print-btn'].addEventListener('click', () => {
      window.print();
    });

    elements['cut-btn'].addEventListener('click', () => execCommand('cut'));
    elements['paste-btn'].addEventListener('click', () => {
      document.execCommand('paste');
    });
    elements['copy-btn'].addEventListener('click', () => execCommand('copy'));
    elements['select-all-btn'].addEventListener('click', () => execCommand('selectAll'));
    elements['undo-btn'].addEventListener('click', () => execCommand('undo'));
    elements['redo-btn'].addEventListener('click', () => execCommand('redo'));
    elements['superscript-btn'].addEventListener('click', () => execCommand('superscript'));
    elements['subscript-btn'].addEventListener('click', () => execCommand('subscript'));
    elements['capitalization-btn'].addEventListener('click', () => {
      const text = window.getSelection().toString();
      const capitalized = text.toUpperCase();
      execCommand('insertText', capitalized);
    });

    elements['insert-dropdown-btn'].addEventListener('click', () => {
      alert('Dropdown insertion functionality not implemented yet.');
    });

    elements['insert-emoji-btn'].addEventListener('click', () => {
      const emoji = prompt('Enter the emoji code (e.g., smile):');
      if (emoji) {
        execCommand('insertHTML', `<i class="fas fa-${emoji}"></i>`);
      }
    });

    function toggleButtonState(button, command) {
      document.queryCommandState(command) ? button.classList.add('btn-primary') : button.classList.remove('btn-primary');
    }

    function execCommand(command, value = null) {
      document.execCommand(command, false, value);
      toggleButtonState(elements['bold-btn'], 'bold');
      toggleButtonState(elements['italic-btn'], 'italic');
      toggleButtonState(elements['underline-btn'], 'underline');
      toggleButtonState(elements['strike-btn'], 'strikeThrough');
    }

    // Add event listeners for formatting
    elements['bold-btn'].addEventListener('click', () => execCommand('bold'));
    elements['italic-btn'].addEventListener('click', () => execCommand('italic'));
    elements['underline-btn'].addEventListener('click', () => execCommand('underline'));
    elements['strike-btn'].addEventListener('click', () => execCommand('strikeThrough'));

    // Add event listeners for alignment
    elements['align-left-btn'].addEventListener('click', () => execCommand('justifyLeft'));
    elements['align-center-btn'].addEventListener('click', () => execCommand('justifyCenter'));
    elements['align-right-btn'].addEventListener('click', () => execCommand('justifyRight'));
    elements['justify-btn'].addEventListener('click', () => execCommand('justifyFull'));

    // Add event listeners for font selection
    elements['font-select'].addEventListener('change', () => execCommand('fontName', elements['font-select'].value));
    elements['font-size-select'].addEventListener('change', () => {
      if (elements['font-size-select'].value === 'custom') {
        elements['custom-font-size'].style.display = 'block';
      } else {
        elements['custom-font-size'].style.display = 'none';
        execCommand('fontSize', elements['font-size-select'].value);
      }
    });
    elements['custom-font-size'].addEventListener('input', () => {
      execCommand('fontSize', elements['custom-font-size'].value);
    });

    // Add event listener for color selection
    elements['color-input'].addEventListener('input', () => execCommand('foreColor', elements['color-input'].value));
    elements['highlight-input'].addEventListener('input', () => execCommand('hiliteColor', elements['highlight-input'].value));

    // Add event listener for inserting table
    elements['insert-table-btn'].addEventListener('click', () => {
      const rows = prompt('Enter number of rows:');
      const cols = prompt('Enter number of columns:');
      if (rows && cols) {
        let table = '<table border="1">';
        for (let i = 0; i < rows; i++) {
          table += '<tr>';
          for (let j = 0; j < cols; j++) {
            table += '<td>&nbsp;</td>';
          }
          table += '</tr>';
        }
        table += '</table>';
        execCommand('insertHTML', table);
      }
    });

    // Add event listener for inserting image
    elements['insert-image-btn'].addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target.result;
          execCommand('insertImage', url);
        };
        reader.readAsDataURL(file);
      };
      input.click();
    });

    elements['link-btn'].addEventListener('click', () => {
      const url = prompt('Enter the URL:');
      const text = prompt('Enter the text for the link:');
      if (url && text) {
        execCommand('createLink', "http://" + url);
        document.getSelection().anchorNode.parentElement.innerHTML = text;
      }
    });

    editor.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        e.preventDefault(); // Prevent default action
        window.open(e.target.href, '_blank'); // Open link in new tab
      }
    });

    elements['bullet-list-btn'].addEventListener('click', () => execCommand('insertUnorderedList'));
    elements['number-list-btn'].addEventListener('click', () => execCommand('insertOrderedList'));

    elements['find-btn'].addEventListener('click', () => {
      const term = prompt('Enter the term to find:');
      if (term) {
        const content = editor.innerHTML;
        const highlighted = content.replace(new RegExp(term, 'gi'), match => `<mark>${match}</mark>`);
        editor.innerHTML = highlighted;
      }
    });

    elements['replace-btn'].addEventListener('click', () => {
      const term = prompt('Enter the term to replace:');
      const replacement = prompt('Enter the replacement:');
      if (term && replacement) {
        const content = editor.innerHTML;
        const replaced = content.replace(new RegExp(term, 'gi'), replacement);
        editor.innerHTML = replaced;
      }
    });

    elements['load-btn'].addEventListener('click', () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.html';
      input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target.result;
          editor.innerHTML = text;
          fileName = file.name.split('.').slice(0, -1).join('.');
          elements['name-input'].value = fileName;
          document.title = fileName;
        };
        reader.readAsText(file);
      };
      input.click();
    });

    // Add event listener for saving with keyboard shortcut
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        elements['save-btn'].click();
      }
    });

    // Ensure button states reflect the current selection
    editor.addEventListener('mouseup', () => {
      toggleButtonState(elements['bold-btn'], 'bold');
      toggleButtonState(elements['italic-btn'], 'italic');
      toggleButtonState(elements['underline-btn'], 'underline');
      toggleButtonState(elements['strike-btn'], 'strikeThrough');
    });

    elements['edit-mode-btn'].addEventListener('click', () => {
      editor.contentEditable = 'true';
      editor.style.border = '1px solid #ccc';
      elements['name-input'].style.display = 'block';
    });

    elements['view-mode-btn'].addEventListener('click', () => {
      editor.contentEditable = 'false';
      editor.style.border = 'none';
      elements['name-input'].style.display = 'none';
      document.title = elements['name-input'].value;
    });
  });