///////////////////////////////////////////////////////////
// FILES MODULE
///////////////////////////////////////////////////////////

/** Singleton class representing the main files object. */
class FilesManager
{
  #errors;
  #deleteInvalidFolderOverride;
  static #instance = null;
  #fileExtensions;
  #locationTypes;
  #roots;
  
  #copyFilePending = new Map();
  #copyFileRequestCounter = 0;
  
  #copyFolderPending = new Map();
  #copyFolderRequestCounter = 0;
  
  #createFilePending = new Map();
  #createFileRequestCounter = 0;
  
  #createFolderPending = new Map();
  #createFolderRequestCounter = 0;
  
  #deleteFilePending = new Map();
  #deleteFileRequestCounter = 0;
  
  #deleteFolderPending = new Map();
  #deleteFolderRequestCounter = 0;
  
  #exportFilePending = new Map();
  #exportFileRequestCounter = 0;
  
  #getAbsoluteRootPathPending = new Map();
  #getAbsoluteRootPathRequestCounter = 0;
  
  #getFilePending = new Map();
  #getFileRequestCounter = 0;
  
  #getFolderPending = new Map();
  #getFolderRequestCounter = 0;
  
  #importFilePending = new Map();
  #importFileRequestCounter = 0;
  
  #moveFilePending = new Map();
  #moveFileRequestCounter = 0;
  
  #moveFolderPending = new Map();
  #moveFolderRequestCounter = 0;

  #readFilePending = new Map();
  #readFileRequestCounter = 0;
  
  #renameFilePending = new Map();
  #renameFileRequestCounter = 0;
  
  #renameFolderPending = new Map();
  #renameFolderRequestCounter = 0;
  
  #writeToFilePending = new Map();
  #writeToFileRequestCounter = 0;
  
  #zipFolderPending = new Map();
  #zipFolderRequestCounter = 0;
  
  /** Creates the files object. **/
  constructor() 
  {
    this.#errors = 
    {
      absolutePathError: 'Files Error: Absolute paths are not allowed.',
      cannotCopyToBundleError: 'Files Error: Cannot copy file to bundle.',
      contentEmpty: 'Files Error: Content empty.',
      contentTypeError: 'Files Error: Expected type string for content.',
      deleteInvalidFolderOverrideError: (subpath) => `Files Error: Cannot delete folder at path ${subpath} without an override.`,
      deleteInvalidFolderOverrideTypeError: 'Files Error: Expected type boolean for delete projects override.',
      directoryTraversalError: 'Files Error: Directory traversal is not allowed.',
      excessiveLengthError: 'Files Error: Excessive length detected for segment of path.',
      fileNameEmpty: 'Files Error: File name empty.',
      fileNameTypeError: 'Files Error: Expected type string for fileName.',
      folderNameEmpty: 'Files Error: Folder name empty.',
      folderNameTypeError: 'Files Error: Expected type string for folderName.',
      invalidCharsError: 'Files Error: Invalid char detected. The following chars are not supported: [<>:"|?*]',
      invalidRootError: 'Files Error: Invalid root detected. Valid values are in files.roots object.',
      newlineTypeError: 'Files Error: Expected type boolean for newline.',
      parsePayloadError: 'Files Error: There was an issue parsing the payload from a success or failure call.',
      replaceTypeError: 'Files Error: Expected type boolean for replace.',
      rootTypeError: 'Files Error: Expected type string for root.',
      singleInstanceError: 'Files Error: Only one FilesManager object can exist at a time.',
      subpathTypeError: 'Files Error: Expected type string for subpath',
      windowsSlashesError: 'Files Error: Windows style slashes are not allowed.'
    };
    
    this.#deleteInvalidFolderOverride = false;

    if(FilesManager.#instance) console.error(this.#errors.singleInstanceError);
    else FilesManager.#instance = this;
    
    this.#fileExtensions = 
    {
      // Images
      gif: '.gif',
      heic: '.heic',
      heif: '.heif',
      jpg: '.jpg',
      jpeg: '.jpeg',
      png: '.png',
    
      // Audio
      mp3: '.mp3',
      ogg: '.ogg',
      wav: '.wav',
      caf: '.caf',
    
      // Video
      mp4: '.mp4',
      mov: '.mov',
      m4v: '.m4v',
    
      // Text
      csv: '.csv',
      json: '.json',
      log: '.log',
      markdown: '.md',
      text: '.txt',
      xml: '.xml',
      
      // Code
      css: '.css',
      html: '.html',
      javascript: '.js',
      swift: '.swift'
    };
    
    this.#locationTypes = 
    {
      file: 'file',
      folder: 'folder',
      partialFolder: 'partial-folder'
    };
    
    this.#roots = 
    {
      bundle: 'Bundle',
      documents: 'Documents',
      library: 'Library',
      temporary: 'tmp'
    };
  }
  
  /** Static method to return a new FilesManager instance. Allows for Singleton+Module pattern. */
  static getInstance() 
  {
    return new FilesManager();
  }
  
  /** 
   * Get property to return the files delete projects override value.
   * @return {Boolean} The delete projects override value of the files module.
   */
  get deleteInvalidFolderOverride()
  {
    return this.#deleteInvalidFolderOverride;
  }
  
  /** 
   * Set property to set the files delete invalid folder override value.
   * @param {Boolean} The delete invalid folder override value.
   */
  set deleteInvalidFolderOverride(value)
  {
    if(!typechecker.check({ type: 'boolean', value: value }))
    {
      console.error(this.#errors.deleteInvalidFolderOverrideTypeError);
      return;
    }
    
    this.#deleteInvalidFolderOverride = value;
  }
  
  /** 
   * Get property to return the files fileExtensions object.
   * @return {object} The supported fileExtensions of the files module.
   */
  get fileExtensions()
  {
    return this.#fileExtensions;
  }
  
  /** 
   * Get property to return the files roots object.
   * @return {object} The supported root paths of the iOS filesystem.
   */
  get roots()
  {
    return this.#roots;
  }
  
  /** 
   * Public method to copy an existing file at the specified path to another path with a optional custom name in the iOS filesystem. 
   * @param {string} oldRoot - The root path filesystem type of the file to be copied.
   * @param {string} newRoot - The root path filesystem type of the folder we intend to do the copy to.
   * @param {string} oldSubpath - The subpath to be added to the oldRootPath.
   * @param {string} newSubpath - The subpath to be added to the newRootPath.
   * @param {string} copiedFileName - Optional file name for the copied file.
   * @return {Promise} - Returns a promise with copyFilePendingResolve as the resolve and copyFilePendingReject as the reject. If the call is successful the method _copyFileSuccess gets called. If the call is unsuccessful, then the _copyFileFail method gets called.
   */
  copyFile({ oldRoot = this.roots.documents, newRoot = this.roots.documents, oldSubpath = '', newSubpath = '', copiedFileName = '' })
  {
    if(!typechecker.check({ type: 'string', value: oldRoot }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(oldRoot))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(!typechecker.check({ type: 'string', value: newRoot }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
    
    if(newRoot === this.roots.bundle)
    {
      console.error(this.#errors.cannotCopyToBundleError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(newRoot))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(this.isValidSubpath({ subpath: oldSubpath }) && this.isValidSubpath({ subpath: newSubpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#copyFileRequestCounter;
        this.#copyFilePending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'copyFile',
          requestId: requestId, 
          oldRoot: oldRoot,
          newRoot: newRoot, 
          oldSubpath: oldSubpath,
          newSubpath: newSubpath,
          copiedFileName: copiedFileName
        });
      });
    }
  }
  
  /** 
   * Public method to copy an existing folder at the specified path to another path with a optional custom name in the iOS filesystem. 
   * @param {string} oldRoot - The root path filesystem type of the folder to be copied.
   * @param {string} newRoot - The root path filesystem type of the folder we intend to do the copy to.
   * @param {string} oldSubpath - The subpath to be added to the oldRootPath.
   * @param {string} newSubpath - The subpath to be added to the newRootPath.
   * @param {string} copiedFolderName - Optional folder name for the copied folder.
   * @return {Promise} - Returns a promise with copyFolderPendingResolve as the resolve and copyFolderPendingReject as the reject. If the call is successful the method _copyFolderSuccess gets called. If the call is unsuccessful, then the _copyFolderFail method gets called.
   */
  copyFolder({ oldRoot = this.roots.documents, newRoot = this.roots.documents, oldSubpath = '', newSubpath = '', copiedFolderName = '' })
  {
    if(!typechecker.check({ type: 'string', value: oldRoot }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(oldRoot))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(!typechecker.check({ type: 'string', value: newRoot }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(newRoot))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(this.isValidSubpath({ subpath: oldSubpath }) && this.isValidSubpath({ subpath: newSubpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#copyFolderRequestCounter;
        this.#copyFolderPending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'copyFolder',
          requestId: requestId, 
          oldRoot: oldRoot,
          newRoot: newRoot, 
          oldSubpath: oldSubpath,
          newSubpath: newSubpath,
          copiedFolderName: copiedFolderName
        });
      });
    }
  }
  
  /** 
   * Public method to create new file at the specified path and return that file after it's been stored in the iOS filesystem. If the file name already exists there then a unique counter will be added to the file name to make it unique.
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @param {string} fileName - The desired name of the file. If no valid extension is given then the extension will be .txt.
   * @return {Promise} - Returns a promise with createFilePendingResolve as the resolve and createFilePendingReject as the reject. If the call is successful the method _createFileSuccess gets called. If the call is unsuccessful and no folder is found, then the _createFileFail method gets called.
   */
  createFile({ root = this.roots.documents, subpath = '', fileName = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(!typechecker.check({ type: 'string', value: fileName })) 
    {
      console.error(this.#errors.fileNameTypeError);
      return;
    }
    
    if(validator.isStringEmpty({ string: fileName }))
    {
      console.error(this.#errors.fileNameEmpty);
      return;
    }
    
    let extensions = Object.values(this.#fileExtensions).map(ext => ext.slice(1)).join('|');
    let regex = new RegExp(`\\.(${extensions})$`, 'i');
    if(!regex.test(fileName)) 
    {
      fileName = fileName.replace(/\.+$/, '');
      fileName += '.txt';
    }
    
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#createFileRequestCounter;
        this.#createFilePending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'createFile',
          requestId: requestId, 
          root: root, 
          subpath: subpath, 
          fileName: fileName
        });
      });
    }
  }
  
  /** 
   * Public method to create new folder at the specified path and return that folder after it's been stored in the iOS filesystem. If the folder name already exists there then a unique counter will be added to the folder name to make it unique.
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @param {string} folderName - The desired name of the folder.
   * @return {Promise} - Returns a promise with createFolderPendingResolve as the resolve and createFolderPendingReject as the reject. If the call is successful the method _createFolderSuccess gets called. If the call is unsuccessful and no folder is found, then the _createFolderFail method gets called.
   */
  createFolder({ root = this.roots.documents, subpath = '', folderName = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(!typechecker.check({ type: 'string', value: folderName })) 
    {
      console.error(this.#errors.folderNameTypeError);
      return;
    }
    
    if(validator.isStringEmpty({ string: folderName }))
    {
      console.error(this.#errors.folderNameEmpty);
      return;
    }
    
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#createFolderRequestCounter;
        this.#createFolderPending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'createFolder',
          requestId: requestId, 
          root: root, 
          subpath: subpath, 
          folderName: folderName
        });
      });
    }
  }
  
  /** 
   * Public method to delete a file stored in the iOS filesystem. 
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @return {Promise} - Returns a promise with deleteFilePendingResolve as the resolve and deleteFilePendingReject as the reject. If the call is successful the method _deleteFileSuccess gets called. If the call is unsuccessful then _deleteFileFail is called.
   */
  deleteFile({ root = this.roots.documents, subpath = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
      
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#deleteFileRequestCounter;
        this.#deleteFilePending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'deleteFile',
          requestId: requestId, 
          root: root, 
          subpath: subpath
        });
      });
    }
  }
  
  /** 
   * Public method to delete a folder stored in the iOS filesystem. 
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @return {Promise} - Returns a promise with deleteFolderPendingResolve as the resolve and deleteFolderPendingReject as the reject. If the call is successful the method deleteFolderSuccess gets called. If the call is unsuccessful then deleteFolderFail is called.
   */
  deleteFolder({ root = this.roots.documents, subpath = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    let containsProjectsSubString = subpath.toLowerCase().includes('projects');
    let isCode = subpath.split('/').filter(Boolean).pop()?.toLowerCase() === 'code';
    let isResources = subpath.split('/').filter(Boolean).pop()?.toLowerCase() === 'resources';
    
    if(containsProjectsSubString === true || isCode === true || isResources === true)
    {
      if(this.deleteInvalidFolderOverride === false) 
      {
        console.error(this.#errors.deleteInvalidFolderOverrideError(subpath));
        return;
      }
    }
  
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#deleteFolderRequestCounter;
        this.#deleteFolderPending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'deleteFolder',
          requestId: requestId, 
          root: root, 
          subpath: subpath
        });
      });
    }
  }
  
  /**
   * Public method to export a file from the iOS filesystem to the files app.
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @return {Promise} - Returns a promise with exportFilePendingResolve as the resolve and 
   * exportFilePendingReject as the reject. If the call is successful the method _exportFileSuccess
   * gets called. If the call is unsuccessful and no folder is found, then the _exportFileFail
   * method gets called.
   */
  exportFile({ root = this.roots.documents, subpath = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
  
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
  
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#exportFileRequestCounter;
        this.#exportFilePending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'exportFile',
          requestId: requestId, 
          root: root, 
          subpath: subpath
        });
      });
    }
  }
  
  /** 
   * Public method to get and return the absolute path of a root directory. 
   * @param {string} root - The root path filesystem type.
   * @return {Promise} - Returns a promise with getAbsoluteRootPathPendingResolve as the resolve and 
   * getAbsoluteRootPathPendingReject as the reject. If the call is successful the method _getAbsoluteRootPathSuccess
   * gets called. If the call is unsuccessful, then the _getAbsoluteRootPathFail method gets called.
   */
  getAbsoluteRootPath({ root = this.roots.documents })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    return new Promise((resolve, reject) =>
    {
      let requestId = ++this.#getAbsoluteRootPathRequestCounter;
      this.#getAbsoluteRootPathPending.set(requestId, { resolve, reject });
  
      window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
        command: 'getAbsoluteRootPath',
        requestId: requestId, 
        root: root
      });
    });
  }
  
  /** 
   * Public method to get and return a file stored in the iOS filesystem. 
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @return {Promise} - Returns a promise with getFilePendingResolve as the resolve and getFilePendingReject as the reject. If the call is successful the method _getFileSuccess gets called. If the call is unsuccessful and no folder is found, then the _getFileFail method gets called.
   */
  getFile({ root = this.roots.documents, subpath = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
      
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#getFileRequestCounter;
        this.#getFilePending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'getFile',
          requestId: requestId, 
          root: root, 
          subpath: subpath
        });
      });
    }
  }
    
  /** 
   * Public method to get and return a folder stored in the iOS filesystem. 
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @return {Promise} - Returns a promise with getFolderPendingResolve as the resolve and 
   * getFolderPendingReject as the reject. If the call is successful the method _getFolderSuccess
   * gets called. If the call is unsuccessful and no folder is found, then the _getFolderFail
   * method gets called.
   */
  getFolder({ root = this.roots.documents, subpath = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#getFolderRequestCounter;
        this.#getFolderPending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'getFolder',
          requestId: requestId,
          root: root,
          subpath: subpath
        });
      });
    }
  }
  
   /**
   * Public method to import a file to the iOS filesystem and return it. 
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @param {string[]} fileExtensions - Allowed file extensions (with dots, e.g. ".js")
   * @return {Promise} - Returns a promise with importFilePendingResolve as the resolve and 
   * importFilePendingReject as the reject. If the call is successful the method _importFileSuccess
   * gets called. If the call is unsuccessful and no folder is found, then the _importFileFail
   * method gets called.
   */
  importFile({ root = this.roots.documents, subpath = '', fileExtensions = Object.values(this.fileExtensions) })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
  
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
  
    if(!Array.isArray(fileExtensions))
    {
      console.error(this.#errors.fileExtensionsTypeError);
      return;
    }
  
    let normalizedExtensions = fileExtensions.map(ext =>
    {
      if(!typechecker.check({ type: 'string', value: ext }))
      {
        console.error(this.#errors.fileExtensionsTypeError);
        return;
      }
  
      return ext
        .trim()
        .toLowerCase()
        .replace(/^\./, '');
    });
  
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#importFileRequestCounter;
        this.#importFilePending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'importFile',
          requestId: requestId, 
          root: root, 
          subpath: subpath,
          fileExtensions: normalizedExtensions
        });
      });
    }
  }
  
  /** 
   * Public method to verify a subpath for the iOS file system. Runs the following checks:
   *
   * - No absolute paths
   * - No directory traversal
   * - No windows style slashes
   * - Invalid chars ([<>:"|?*])
   * - Excessive length for a segment of the subpath (255 char max typical FS limit)
   *
   * @param {string} subpath - The name of the font to reference that should be registered in the map.
   * @return {boolean} - Returns if the sub path is valid or not based on the checks.
   */
  isValidSubpath({ subpath }) 
  {
    if(!typechecker.check({ type: 'string', value: subpath }))
    {
      console.error(this.#errors.subpathTypeError);
      return false;
    }

    subpath = subpath.trim();
  
    if(subpath.startsWith("/") || subpath.startsWith("~")) 
    {
      console.error(this.#errors.absolutePathError);
      return false;
    }
  
    if(subpath.includes("..")) 
    {
      console.error(this.#errors.directoryTraversalError);
      return false;
    }
  
    if(subpath.includes("\\")) 
    {
      console.error(this.#errors.windowsSlashesError);
      return false;
    }

    let invalidChars = /[<>:"|?*]/;
    if(invalidChars.test(subpath)) 
    {
      console.error(this.#errors.invalidCharsError);
      return false;
    }
  
    let segments = subpath.split("/");
    if(segments.some(seg => seg.length > 255)) 
    {
      console.error(this.#errors.excessiveLengthError);
      return false;
    }
  
    return true;
  }
  
  /** 
   * Public method to move an existing file at the specified path to another folder in the iOS filesystem. 
   * @param {string} oldRoot - The root path filesystem type of the file to moved.
   * @param {string} newRoot - The root path filesystem type of the folder we intend to the move to.
   * @param {string} oldSubpath - The subpath to be added to the oldRootPath.
   * @param {string} newSubpath - The subpath to be added to the newRootPath.
   * @return {Promise} - Returns a promise with moveFilePendingResolve as the resolve and moveFilePendingReject as the reject. If the call is successful the method _movedFileSuccess gets called. If the call is unsuccessful and no folder is found, then the _movedFileFail method gets called.
   */
  moveFile({ oldRoot = this.roots.documents, newRoot = this.roots.documents, oldSubpath = '', newSubpath = '' })
  {
    if(!typechecker.check({ type: 'string', value: oldRoot }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(oldRoot))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(!typechecker.check({ type: 'string', value: newRoot }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(newRoot))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(this.isValidSubpath({ subpath: oldSubpath }) && this.isValidSubpath({ subpath: newSubpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#moveFileRequestCounter;
        this.#moveFilePending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'moveFile',
          requestId: requestId, 
          oldRoot: oldRoot,
          newRoot: newRoot, 
          oldSubpath: oldSubpath,
          newSubpath: newSubpath
        });
      });
    }
  }
  
  /** 
   * Public method to move an existing folder at the specified path to another folder in the iOS filesystem. 
   * @param {string} oldRoot - The root path filesystem type of the folder to moved.
   * @param {string} newRoot - The root path filesystem type of the folder we intend to the move to.
   * @param {string} oldSubpath - The subpath to be added to the oldRootPath.
   * @param {string} newSubpath - The subpath to be added to the newRootPath.
   * @return {Promise} - Returns a promise with moveFolderPendingResolve as the resolve and moveFolderPendingReject as the reject. If the call is successful the method _moveFolderSuccess gets called. If the call is unsuccessful and no folder is found, then the _moveFolderFail method gets called.
   */
  moveFolder({ oldRoot = this.roots.documents, newRoot = this.roots.documents, oldSubpath = '', newSubpath = '' })
  {
    if(!typechecker.check({ type: 'string', value: oldRoot }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(oldRoot))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(!typechecker.check({ type: 'string', value: newRoot }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(newRoot))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(this.isValidSubpath({ subpath: oldSubpath }) && this.isValidSubpath({ subpath: newSubpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#moveFolderRequestCounter;
        this.#moveFolderPending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'moveFolder',
          requestId: requestId, 
          oldRoot: oldRoot,
          newRoot: newRoot, 
          oldSubpath: oldSubpath,
          newSubpath: newSubpath
        });
      });
    }
  }
  
  /** 
   * Public method to read a file from the iOS filesystem.
   * Returns a Promise that resolves or rejects when Swift responds.
   *
   * @param {Object} options - Options object containing:
   *   - root {String} : The root filesystem path to read from (e.g., documents, library, tmp). Defaults to documents.
   *   - subpath {String} : The relative path to the file within the root. Defaults to empty string.
   * @return {Promise} - A Promise that resolves with the file content if successful, or rejects with an error.
   *                     Each call generates a unique requestId, which Swift includes in the response.
   *                     On success, `_readFileSuccess(payload)` is called from Swift.
   *                     On failure, `_readFileFail(payload)` is called from Swift.
   */
  readFile({ root = this.roots.documents, subpath = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#readFileRequestCounter;
        this.#readFilePending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'readFile',
          requestId: requestId,
          root: root,
          subpath: subpath
        });
      });
    }
  }
  
  /** 
   * Public method to rename an existing file at the specified path and return that modified file in the iOS filesystem. 
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @param {string} folderName - The desired name of the file.
   * @return {Promise} - Returns a promise with renameFilePendingResolve as the resolve and renameFilePendingReject as the reject. If the call is successful the method _renameFileSuccess gets called. If the call is unsuccessful and no file is found, then the _renameFileFail method gets called.
   */
  renameFile({ root = this.roots.documents, subpath = '', fileName = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(!typechecker.check({ type: 'string', value: fileName })) 
    {
      console.error(this.#errors.fileNameTypeError);
      return;
    }
    
    if(validator.isStringEmpty({ string: fileName }))
    {
      console.error(this.#errors.fileNameEmpty);
      return;
    }
    
    let extensions = Object.values(this.#fileExtensions).map(ext => ext.slice(1)).join('|');
    let regex = new RegExp(`\\.(${extensions})$`, 'i');
    if(!regex.test(fileName)) 
    {
      fileName = fileName.replace(/\.+$/, '');
      fileName += '.txt';
    }
    
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#renameFileRequestCounter;
        this.#renameFilePending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'renameFile',
          requestId: requestId,
          root: root,
          subpath: subpath,
          fileName: fileName
        });
      });
    }
  }
  
  /** 
   * Public method to rename an existing folder at the specified path and return that modified folder in the iOS filesystem. 
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @param {string} folderName - The desired name of the folder.
   * @return {Promise} - Returns a promise with renameFolderPendingResolve as the resolve and renameFolderPendingReject as the reject. If the call is successful the method renameFolderSuccess gets called. If the call is unsuccessful and no folder is found, then the renameFolderFail method gets called.
   */
  renameFolder({ root = this.roots.documents, subpath = '', folderName = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(!typechecker.check({ type: 'string', value: folderName })) 
    {
      console.error(this.#errors.folderNameTypeError);
      return;
    }
    
    if(validator.isStringEmpty({ string: folderName }))
    {
      console.error(this.#errors.folderNameEmpty);
      return;
    }
    
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#renameFolderRequestCounter;
        this.#renameFolderPending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'renameFolder',
          requestId: requestId,
          root: root,
          subpath: subpath,
          folderName: folderName
        });
      });
    }
  }
  
  /** 
   * Public method to write string content to a text based file in the iOS file system. 
   * @param {string} root - The root path filesystem type.
   * @param {string} subpath - The subpath to be added to the root path.
   * @param {string} content - The content to be written to the file.
   * @param {boolean} replace - Boolean flag determining if the current content in the file should be cleared before writing the new content.
   * @param {boolean} newline - Boolean flag determining if the content should be written to a newline in the file.
   * @return {Promise} - Returns a promise with writeToFilePendingResolve as the resolve and writeToFilePendingReject as the reject. If the call is successful the _writeToFileSuccess method gets called. If the call is unsuccessful and the writing was not performed, then the _writeToFileFail method gets called.
   */
  writeToFile({ root = this.roots.documents, subpath = '', content = '', replace = false, newline = true })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
   
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
    
    if(!typechecker.check({ type: 'string', value: content })) 
    {
      console.error(this.#errors.contentTypeError);
      return;
    }
    
    if(!typechecker.check({ type: 'boolean', value: replace }))
    {
      console.error(this.#errors.replaceTypeError);
      return;
    }
    
    if(!typechecker.check({ type: 'boolean', value: newline }))
    {
      console.error(this.#errors.newlineTypeError);
      return;
    }
    
    if(this.isValidSubpath({ subpath: subpath }))
    {
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#writeToFileRequestCounter;
        this.#writeToFilePending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'writeToFile',
          requestId: requestId, 
          root: root, 
          subpath: subpath,
          content: content, 
          replace: replace,
          newline: newline
        });
      });
    }
  }
  
  /**
   * Zips a folder in place and saves the resulting zip file
   * in the same directory as the source folder.
   *
   * This method validates the provided root and subpath, ensures
   * a valid zip filename (auto-appending `.zip` if missing),
   * and sends a message to the native FilesMessageManager to
   * perform the zip operation.
   *
   * The native layer resolves the folder, zips it using
   * NSFileCoordinator, treats the result as a File, serializes it,
   * and returns it via a success callback.
   *
   * @param {Object} options
   * @param {string} options.root Base directory
   *   ("Documents", "Library", "tmp").
   * @param {string} options.subpath Relative path to the folder to zip.
   * @param {string} options.zippedFileName Name of the resulting zip file.
   *
   * @returns {Promise<Object>} Resolves with the serialized File object
   *   representing the newly created zip file.
   *
   * Native callbacks:
   * - files._zipFolderSuccess(data): Called on success.
   * - files._zipFolderFail(error): Called on failure.
   */
  zipFolder({ root = this.roots.documents, subpath = '', zippedFileName = '' })
  {
    if(!typechecker.check({ type: 'string', value: root }))
    {
      console.error(this.#errors.rootTypeError);
      return;
    }
  
    if(!Object.values(this.#roots).includes(root))
    {
      console.error(this.#errors.invalidRootError);
      return;
    }
  
    if(!typechecker.check({ type: 'string', value: zippedFileName })) 
    {
      console.error(this.#errors.fileNameTypeError);
      return;
    }
    
    if(validator.isStringEmpty({ string: zippedFileName }))
    {
      console.error(this.#errors.fileNameEmpty);
      return;
    }
  
    if(this.isValidSubpath({ subpath: subpath }))
    {
      let finalZipName = zippedFileName.toLowerCase().endsWith('.zip') ? zippedFileName : `${zippedFileName}.zip`;
      return new Promise((resolve, reject) =>
      {
        let requestId = ++this.#zipFolderRequestCounter;
        this.#zipFolderPending.set(requestId, { resolve, reject });
    
        window.webkit?.messageHandlers?.filesMessageManager?.postMessage({
          command: 'zipFolder',
          requestId: requestId, 
          root: root, 
          subpath: subpath,
          zippedFileName: finalZipName
        });
      });
    }
  }
  
  /** 
   * Public method called by Swift when a file has been successfully copied
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned file object represents the newly copied file and includes
   * metadata about the file and its parent folder. Location types are assigned
   * to normalize the structure for use within the files module.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original copyFile request.
   *   - data {Object} : The file object representing the newly copied file.
   */
  _copyFileSuccess(payload)
  {
    let pending = this.#copyFilePending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.file;
    
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
    
    pending.resolve(payload.data);
    this.#copyFilePending.delete(payload.requestId);
  }
  
  
  /** 
   * Public method called by Swift when a file could not be copied
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original copyFile request.
   *   - error {String} : The error message describing why the file could not be copied.
   */
  _copyFileFail(payload) 
  {
    let pending = this.#copyFilePending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#copyFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder has been successfully copied
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned folder object represents the newly copied folder and includes
   * metadata about the folder itself, its parent folder, any subfolders, and any
   * files contained within it. Location types are assigned to normalize the
   * structure for use within the files module.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original copyFolder request.
   *   - data {Object} : The folder object representing the newly copied folder,
   *                     including its subfolders and files.
   */
  _copyFolderSuccess(payload)
  {
    let pending = this.#copyFolderPending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.folder;
    
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
    if(payload.data.subfolders.length !== 0) 
    {
      for(let sub of payload.data.subfolders) 
      {
        sub.type = this.#locationTypes.partialFolder;
      }
    }
    
    if(payload.data.files.length !== 0) 
    {
      for(let file of payload.data.files) 
      {
        file.type = this.#locationTypes.file;
        if(file.parentFolder) file.parentFolder.type = this.#locationTypes.partialFolder;
      }
    }
    
    pending.resolve(payload.data);
    this.#copyFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder could not be copied
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original copyFolder request.
   *   - error {String} : The error message describing why the folder could not be copied.
   */
  _copyFolderFail(payload) 
  {
    let pending = this.#copyFolderPending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#copyFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file has been successfully created
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned file object represents the newly created file and includes
   * metadata about the file and its parent folder. Location types are assigned
   * to normalize the structure for use within the files module.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original createFile request.
   *   - data {Object} : The file object representing the newly created file.
   */
  _createFileSuccess(payload)
  {
    let pending = this.#createFilePending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.file;
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
  
    pending.resolve(payload.data);
    this.#createFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file could not be created
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original createFile request.
   *   - error {String} : The error message describing why the file could not be created.
   */
  _createFileFail(payload) 
  {
    let pending = this.#createFilePending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#createFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder has been successfully created
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned folder object represents the newly created folder and includes
   * metadata about the folder itself, its parent folder, any subfolders, and any
   * files contained within it. Location types are assigned to normalize the
   * structure for use within the files module.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original createFolder request.
   *   - data {Object} : The folder object representing the newly created folder,
   *                     including its subfolders and files.
   */
  _createFolderSuccess(payload)
  {
    let pending = this.#createFolderPending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.folder;
    
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
    if(payload.data.subfolders.length !== 0) 
    {
      for(let sub of payload.data.subfolders) 
      {
        sub.type = this.#locationTypes.partialFolder;
      }
    }
    
    if(payload.data.files.length !== 0) 
    {
      for(let file of payload.data.files) 
      {
        file.type = this.#locationTypes.file;
        if(file.parentFolder) file.parentFolder.type = this.#locationTypes.partialFolder;
      }
    }
    
    pending.resolve(payload.data);
    this.#createFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder could not be created
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original createFolder request.
   *   - error {String} : The error message describing why the folder could not be created.
   */
  _createFolderFail(payload) 
  {
    let pending = this.#createFolderPending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#createFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file has been successfully deleted
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned data typically represents metadata about the deleted file
   * or confirmation information from the native layer.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original deleteFile request.
   *   - data {Object} : Information related to the deleted file.
   */
  _deleteFileSuccess(payload)
  {    
    let pending = this.#deleteFilePending.get(payload.requestId);
    if(!pending) return;
    
    pending.resolve(payload.data);
    this.#deleteFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file could not be deleted
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original deleteFile request.
   *   - error {String} : The error message describing why the file could not be deleted.
   */
  _deleteFileFail(payload)
  {
    let pending = this.#deleteFilePending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#deleteFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder has been successfully deleted
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned data typically represents metadata or confirmation information
   * about the deleted folder from the native layer.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original deleteFolder request.
   *   - data {Object} : Information related to the deleted folder.
   */
  _deleteFolderSuccess(payload)
  {
    let pending = this.#deleteFolderPending.get(payload.requestId);
    if(!pending) return;
    
    pending.resolve(payload.data);
    this.#deleteFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder could not be deleted
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original deleteFolder request.
   *   - error {String} : The error message describing why the folder could not be deleted.
   */
  _deleteFolderFail(payload)
  {
    let pending = this.#deleteFolderPending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#deleteFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file has been successfully exported
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned data typically represents metadata or confirmation information
   * about the exported file from the native layer.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original exportFile request.
   *   - data {Object} : Information related to the exported file.
   */
  _exportFileSuccess(payload)
  {  
    let pending = this.#exportFilePending.get(payload.requestId);
    if(!pending) return;
    
    pending.resolve(payload.data);
    this.#exportFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file could not be exported
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original exportFile request.
   *   - error {String} : The error message describing why the file could not be exported.
   */
  _exportFileFail(payload)
  {
    let pending = this.#exportFilePending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#exportFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when the absolute path of a root directory
   * has been successfully retrieved via the files module. Resolves the
   * corresponding Promise based on the requestId.
   *
   * The returned data represents the absolute file system path for the
   * specified root location on the device (e.g., Documents, Library, tmp).
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original getAbsoluteRootPath request.
   *   - data {Object} : Object containing the absolute path and root to the requested root directory.
   */
  _getAbsoluteRootPathSuccess(payload)
  {
    let pending = this.#getAbsoluteRootPathPending.get(payload.requestId);
    if(!pending) return;
    
    pending.resolve(payload.data);
    this.#getAbsoluteRootPathPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when the absolute path of a root directory
   * could not be retrieved via the files module. Rejects the corresponding
   * Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original getAbsoluteRootPath request.
   *   - error {String} : The error message describing why the root path could not be retrieved.
   */
  _getAbsoluteRootPathFail(payload) 
  {
    console.log(payload);
    let pending = this.#getAbsoluteRootPathPending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#getAbsoluteRootPathPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when file information has been successfully
   * retrieved via the files module. Resolves the corresponding Promise based
   * on the requestId.
   *
   * The returned data represents the file metadata retrieved from the native
   * file system. The method also assigns the appropriate location type to the
   * file and its parent folder before resolving the Promise.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original getFile request.
   *   - data {Object} : The file metadata retrieved from the native file system.
   */
  _getFileSuccess(payload)
  {
    let pending = this.#getFilePending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.file;
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
    
    pending.resolve(payload.data);
    this.#getFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when file information could not be retrieved
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original getFile request.
   *   - error {String} : The error message describing why the file could not be retrieved.
   */
  _getFileFail(payload) 
  {
    let pending = this.#getFilePending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#getFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder has been successfully retrieved
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned folder object may contain metadata for the folder itself, its
   * parent folder, any subfolders, and any files. Each location object is assigned
   * a type property to normalize the structure for use within the files module.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original getFolder request.
   *   - data {Object} : The folder object containing information about the folder,
   *                    its parent folder, subfolders, and files.
   */
  _getFolderSuccess(payload)
  {
    let pending = this.#getFolderPending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.folder;
    
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
    if(payload.data.subfolders.length !== 0) 
    {
      for(let sub of payload.data.subfolders) 
      {
        sub.type = this.#locationTypes.partialFolder;
      }
    }
    
    if(payload.data.files.length !== 0) 
    {
      for(let file of payload.data.files) 
      {
        file.type = this.#locationTypes.file;
        if(file.parentFolder) file.parentFolder.type = this.#locationTypes.partialFolder;
      }
    }
    
    pending.resolve(payload.data);
    this.#getFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder could not be retrieved
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original getFolder request.
   *   - error {String} : The error message describing why the folder could not be retrieved.
   */
  _getFolderFail(payload) 
  {
    let pending = this.#getFolderPending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#getFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file has been successfully imported
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned data represents the imported file metadata retrieved from the
   * native file picker or import operation. The method assigns the appropriate
   * location type to the imported file and its parent folder before resolving
   * the Promise.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original importFile request.
   *   - data {Array} : An array containing metadata for the imported file(s).
   */
  _importFileSuccess(payload)
  {
    let pending = this.#importFilePending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.file;
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;  
    
    pending.resolve(payload.data[0]);
    this.#importFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file could not be imported
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original importFile request.
   *   - error {String} : The error message describing why the file could not be imported.
   */
  _importFileFail(payload)
  {
    let pending = this.#importFilePending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#importFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file has been successfully moved
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned data represents metadata about the moved file and its new
   * location. The method assigns the appropriate location type to the file
   * and its parent folder before resolving the Promise.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original moveFile request.
   *   - data {Object} : The file metadata representing the moved file.
   */
  _moveFileSuccess(payload)
  {
    let pending = this.#moveFilePending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.file;
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
    
    pending.resolve(payload.data);
    this.#moveFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file could not be moved
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original moveFile request.
   *   - error {String} : The error message describing why the file could not be moved.
   */
  _moveFileFail(payload) 
  {
    let pending = this.#moveFilePending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#moveFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder has been successfully moved
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned data represents the folder metadata at its new location.
   * The method assigns the appropriate location types to the folder,
   * its parent folder, its subfolders, and its contained files before
   * resolving the Promise.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original moveFolder request.
   *   - data {Object} : The folder object representing the moved folder,
   *                     including its subfolders and files.
   */
  _moveFolderSuccess(payload)
  {
    let pending = this.#moveFolderPending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.folder;
    
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
    if(payload.data.subfolders.length !== 0) 
    {
      for(let sub of payload.data.subfolders) 
      {
        sub.type = this.#locationTypes.partialFolder;
      }
    }
    
    if(payload.data.files.length !== 0) 
    {
      for(let file of payload.data.files) 
      {
        file.type = this.#locationTypes.file;
        if(file.parentFolder) file.parentFolder.type = this.#locationTypes.partialFolder;
      }
    }
    
    pending.resolve(payload.data);
    this.#moveFolderPending.delete(payload.requestId); 
  }
  
  /** 
   * Public method called by Swift when a folder could not be moved
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original moveFolder request.
   *   - error {String} : The error message describing why the folder could not be moved.
   */
  _moveFolderFail(payload) 
  {
    let pending = this.#moveFolderPending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#moveFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file has been successfully read via the files module.
   * Resolves the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original readFile request.
   *   - data {String} : The contents of the file that was read.
   */
  _readFileSuccess(payload)
  {
    let pending = this.#readFilePending.get(payload.requestId);
    if(!pending) return;
    
    pending.resolve(payload.data);
    this.#readFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file could not be read via the files module.
   * Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original readFile request.
   *   - error {String} : The error message describing why the file could not be read.
   */
  _readFileFail(payload)
  {
    let pending = this.#readFilePending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#readFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file has been successfully renamed
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned data represents the updated file metadata after the rename
   * operation. The method assigns the appropriate location type to the file
   * and its parent folder before resolving the Promise.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original renameFile request.
   *   - data {Object} : The file metadata representing the renamed file.
   */
  _renameFileSuccess(payload) 
  {
    let pending = this.#renameFilePending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.file;
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
    
    pending.resolve(payload.data);
    this.#renameFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a file could not be renamed
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original renameFile request.
   *   - error {String} : The error message describing why the file could not be renamed.
   */
  _renameFileFail(payload) 
  {
    let pending = this.#renameFilePending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#renameFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder has been successfully renamed
   * via the files module. Resolves the corresponding Promise based on the requestId.
   *
   * The returned data represents the updated folder metadata after the rename
   * operation. The method assigns the appropriate location types to the folder,
   * its parent folder, its subfolders, and its contained files before resolving
   * the Promise.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original renameFolder request.
   *   - data {Object} : The folder object representing the renamed folder,
   *                     including its subfolders and files.
   */
  _renameFolderSuccess(payload)
  {
    let pending = this.#renameFolderPending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.folder;
    
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
    if(payload.data.subfolders.length !== 0) 
    {
      for(let sub of payload.data.subfolders) 
      {
        sub.type = this.#locationTypes.partialFolder;
      }
    }
    
    if(payload.data.files.length !== 0) 
    {
      for(let file of payload.data.files) 
      {
        file.type = this.#locationTypes.file;
        if(file.parentFolder) file.parentFolder.type = this.#locationTypes.partialFolder;
      }
    }
    
    pending.resolve(payload.data);
    this.#renameFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder could not be renamed
   * via the files module. Rejects the corresponding Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original renameFolder request.
   *   - error {String} : The error message describing why the folder could not be renamed.
   */
  _renameFolderFail(payload) 
  {
    let pending = this.#renameFolderPending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#renameFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when content has been successfully written
   * to a file via the files module. Resolves the corresponding Promise based
   * on the requestId.
   *
   * The returned data typically represents the updated file metadata or
   * confirmation of the write operation, depending on the implementation
   * returned by the native layer.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original writeToFile request.
   *   - data {Object|String|Boolean} : The result of the write operation returned
   *                                    from Swift.
   */
  _writeToFileSuccess(payload)
  {
    let pending = this.#writeToFilePending.get(payload.requestId);
    if(!pending) return;
    
    pending.resolve(payload.data);
    this.#writeToFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when content could not be written to a file
   * via the files module. Rejects the corresponding Promise based on the
   * requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original writeToFile request.
   *   - error {String} : The error message describing why the write operation failed.
   */
  _writeToFileFail(payload)
  {
    let pending = this.#writeToFilePending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#writeToFilePending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder has been successfully compressed
   * into a ZIP archive via the files module. Resolves the corresponding Promise
   * based on the requestId.
   *
   * The returned data represents the metadata of the newly created ZIP file.
   * The method assigns the appropriate location types to the file and its
   * parent folder before resolving the Promise.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original zipFolder request.
   *   - data {Object} : The file metadata representing the created ZIP archive.
   */
  _zipFolderSuccess(payload)
  {
    let pending = this.#zipFolderPending.get(payload.requestId);
    if(!pending) return;
    
    payload.data.type = this.#locationTypes.file;
    if(payload.data.parentFolder) payload.data.parentFolder.type = this.#locationTypes.partialFolder;
    
    pending.resolve(payload.data);
    this.#zipFolderPending.delete(payload.requestId);
  }
  
  /** 
   * Public method called by Swift when a folder could not be compressed
   * into a ZIP archive via the files module. Rejects the corresponding
   * Promise based on the requestId.
   *
   * @param {Object} payload - The payload sent from Swift. Contains:
   *   - requestId {Number} (optional) : The ID of the original zipFolder request.
   *   - error {String} : The error message describing why the folder
   *                     could not be zipped.
   */
  _zipFolderFail(payload) 
  {
    let pending = this.#zipFolderPending.get(payload.requestId);
    if(!pending) return;
  
    pending.reject(payload.error);
    this.#zipFolderPending.delete(payload.requestId);
  }
}

///////////////////////////////////////////////////////////

globalThis.files = FilesManager.getInstance();

///////////////////////////////////////////////////////////