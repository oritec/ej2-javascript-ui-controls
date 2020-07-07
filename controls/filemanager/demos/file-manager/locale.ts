import '../../node_modules/es6-promise/dist/es6-promise';
import { L10n } from '@syncfusion/ej2-base';
import { FileManager } from '../../src/file-manager/base/file-manager';
import { NavigationPane, DetailsView } from '../../src/file-manager/layout/index';
import { Toolbar } from '../../src/file-manager/actions/toolbar';

FileManager.Inject(NavigationPane, DetailsView, Toolbar);

L10n.load({
    "en": {
        "filemanager": {
            "NewFolder": "New folder",
            "Upload": "Upload",
            "Delete": "Delete",
            "Rename": "Rename",
            "Download": "Download",
            "Cut": "Cut",
            "Copy": "Copy",
            "Paste": "Paste",
            "SortBy": "Sort by",
            "Refresh": "Refresh",
            "Item-Selection": "item selected",
            "Items-Selection": "items selected",
            "View": "View",
            "Details": "Details",
            "SelectAll": "Select all",
            "Open": "Open",
            "Tooltip-NewFolder": "New folder",
            "Tooltip-Upload": "Upload",
            "Tooltip-Delete": "Delete",
            "Tooltip-Rename": "Rename",
            "Tooltip-Download": "Download",
            "Tooltip-Cut": "Cut",
            "Tooltip-Copy": "Copy",
            "Tooltip-Paste": "Paste",
            "Tooltip-SortBy": "Sort by",
            "Tooltip-Refresh": "Refresh",
            "Tooltip-Selection": "Clear selection",
            "Tooltip-View": "View",
            "Tooltip-Details": "Details",
            "Tooltip-SelectAll": "Select all",
            "Name": "Name",
            "Size": "Size",
            "DateModified": "Modified",
            "DateCreated": "Date created",
            "Path": "Path",
            "Modified": "Modified",
            "Created": "Created",
            "Location": "Location",
            "Type": "Type",
            "Permission": "Permission",
            "Ascending": "Ascending",
            "Descending": "Descending",
            "None": "None",
            "View-LargeIcons": "Large icons",
            "View-Details": "Details",
            "Search": "Search",
            "Button-Ok": "OK",
            "Button-Cancel": "Cancel",
            "Button-Yes": "Yes",
            "Button-No": "No",
            "Button-Create": "Create",
            "Button-Save": "Save",
            "Header-NewFolder": "Folder",
            "Content-NewFolder": "Enter your folder name",
            "Header-Rename": "Rename",
            "Content-Rename": "Enter your new name",
            "Header-Rename-Confirmation": "Rename Confirmation",
            "Content-Rename-Confirmation": "If you change a file name extension, the file might become unstable. Are you sure you want to change it?",
            "Header-Delete": "Delete File",
            "Content-Delete": "Are you sure you want to delete this file?",
            "Header-Multiple-Delete": "Delete Multiple Files",
            "Content-Multiple-Delete": "Are you sure you want to delete these {0} files?",
            "Header-Duplicate": "File/Folder exists",
            "Content-Duplicate": "{0} already exists. Do you want to rename and paste?",
            "Header-Upload": "Upload Files",
            "Error": "Error",
            "Validation-Empty": "The file or folder name cannot be empty.",
            "Validation-Invalid": "The file or folder name {0} contains invalid characters. Please use a different name. Valid file or folder names cannot end with a dot or space, and cannot contain any of the following characters: \\/:*?\"<>|",
            "Validation-NewFolder-Exists": "A file or folder with the name {0} already exists.",
            "Validation-Rename-Exists": "Cannot rename {0} to {1}: destination already exists.",
            "Folder-Empty": "This folder is empty",
            "File-Upload": "Drag files here to upload",
            "Search-Empty": "No results found",
            "Search-Key": "Try with different keywords",
            "Sub-Folder-Error": "The destination folder is the subfolder of the source folder.",
            "Access-Denied": "Access Denied",
            "Access-Details": "You don't have permission to access this folder.",
            "Header-Retry": "File Already Exists",
            "Content-Retry": "A file with this name already exists in this folder. What would you like to do?",
            "Button-Keep-Both": "Keep both",
            "Button-Replace": "Replace",
            "Button-Skip": "Skip",
            "ApplyAll-Label": "Do this for all current items",
			"Network-Error": "NetworkError: Failed to send on XMLHTTPRequest: Failed to load",
			"Server-Error": "ServerError: Invalid response from"
        }
    },
    "de": {
        "filemanager": {
            "NewFolder": "Neuer Ordner",
            "Upload": "Hochladen",
            "Delete": "Löschen",
            "Rename": "Umbenennen",
            "Download": "Herunterladen",
            "Cut": "Schnitt",
            "Copy": "Kopieren",
            "Paste": "Einfügen",
            "SortBy": "Sortiere nach",
            "Refresh": "Aktualisierung",
            "Item-Selection": "Artikel ausgewählt",
            "Items-Selection": "Elemente ausgewählt",
            "View": "Aussicht",
            "Details": "Einzelheiten",
            "SelectAll": "Wählen Sie Alle",
            "Open": "Öffnen",
            "Tooltip-NewFolder": "Neuer Ordner",
            "Tooltip-Upload": "Hochladen",
            "Tooltip-Delete": "Löschen",
            "Tooltip-Rename": "Umbenennen",
            "Tooltip-Download": "Herunterladen",
            "Tooltip-Cut": "Schnitt",
            "Tooltip-Copy": "Kopieren",
            "Tooltip-Paste": "Einfügen",
            "Tooltip-SortBy": "Sortiere nach",
            "Tooltip-Refresh": "Aktualisierung",
            "Tooltip-Selection": "Auswahl aufheben",
            "Tooltip-View": "Aussicht",
            "Tooltip-Details": "Einzelheiten",
            "Tooltip-SelectAll": "Wählen Sie Alle",
            "Name": "Name",
            "Size": "Größe",
            "DateModified": "Geändert",
            "DateCreated": "Datum erstellt",
            "Path": "Pfad",
            "Modified": "Geändert",
            "Created": "Erstellt",
            "Location": "Ort",
            "Type": "Art",
            "Permission": "Genehmigung",
            "Ascending": "Aufsteigend",
            "Descending": "Absteigend",
            "None": "Keiner",
            "View-LargeIcons": "Große Icons",
            "View-Details": "Einzelheiten",
            "Search": "Suche",
            "Button-Ok": "OK",
            "Button-Cancel": "Stornieren",
            "Button-Yes": "Ja",
            "Button-No": "Nein",
            "Button-Create": "Erstellen",
            "Button-Save": "Sparen",
            "Header-NewFolder": "Mappe",
            "Content-NewFolder": "Geben Sie Ihren Ordnernamen ein",
            "Header-Rename": "Umbenennen",
            "Content-Rename": "Geben Sie Ihren neuen Namen ein",
            "Header-Rename-Confirmation": "Bestätigung umbenennen",
            "Content-Rename-Confirmation": "Wenn Sie eine Dateinamenerweiterung ändern, wird die Datei möglicherweise instabil. Möchten Sie sie wirklich ändern?",
            "Header-Delete": "Datei löschen",
            "Content-Delete": "Möchten Sie diese Datei wirklich löschen?",
            "Header-Multiple-Delete": "Mehrere Dateien löschen",
            "Content-Multiple-Delete": "Möchten Sie diese {0} Dateien wirklich löschen?",
            "Header-Duplicate": "Datei / Ordner existiert",
            "Content-Duplicate": "{0} existiert bereits. Möchten Sie umbenennen und einfügen?",
            "Header-Upload": "Daten hochladen",
            "Error": "Error",
            "Validation-Empty": "Der Datei - oder Ordnername darf nicht leer sein.",
            "Validation-Invalid": "Der Datei- oder Ordnername {0} enthält ungültige Zeichen. Bitte verwenden Sie einen anderen Namen. Gültige Datei- oder Ordnernamen dürfen nicht mit einem Punkt oder Leerzeichen enden und keines der folgenden Zeichen enthalten: \\ /: *? \" < > | ",
            "Validation-NewFolder-Exists": "Eine Datei oder ein Ordner mit dem Namen {0} existiert bereits.",
            "Validation-Rename-Exists": "{0} kann nicht in {1} umbenannt werden: Ziel existiert bereits.",
            "Folder-Empty": "Dieser Ordner ist leer",
            "File-Upload": "Dateien zum Hochladen hierher ziehen",
            "Search-Empty": "Keine Ergebnisse gefunden",
            "Search-Key": "Versuchen Sie es mit anderen Stichwörtern",
            "Sub-Folder-Error": "Der Zielordner ist der Unterordner des Quellordners.",
            "Access-Denied": "Zugriff verweigert",
            "Access-Details": "Sie haben keine Berechtigung, auf diesen Ordner zuzugreifen.",
            "Header-Retry": "Die Datei existiert bereits",
            "Content-Retry": "In diesem Ordner ist bereits eine Datei mit diesem Namen vorhanden. Was möchten Sie tun?",
            "Button-Keep-Both": "Behalte beides",
            "Button-Replace": "Ersetzen",
            "Button-Skip": "Überspringen",
            "ApplyAll-Label": "Mache das für alle aktuellen Artikel",
			"Network-Error": "NetworkError: Fehler beim Senden auf XMLHTTPRequest: Fehler beim Laden",
			"Server-Error": "ServerError: Ungültige Antwort von"
        }
    },
    "fr-CH": {
        "filemanager": {
            "NewFolder": "Nouveau dossier",
            "Upload": "Télécharger",
            "Delete": "Effacer",
            "Rename": "Renommer",
            "Download": "Télécharger",
            "Cut": "Couper",
            "Copy": "Copie",
            "Paste": "Coller",
            "SortBy": "Trier par",
            "Refresh": "Rafraîchir",
            "Item-Selection": "article sélectionné",
            "Items-Selection": "articles sélectionnés",
            "View": "Vue",
            "Details": "Détails",
            "SelectAll": "Tout sélectionner",
            "Open": "Ouvrir",
            "Tooltip-NewFolder": "Nouveau dossier",
            "Tooltip-Upload": "Télécharger",
            "Tooltip-Delete": "Effacer",
            "Tooltip-Rename": "Renommer",
            "Tooltip-Download": "Télécharger",
            "Tooltip-Cut": "Couper",
            "Tooltip-Copy": "Copie",
            "Tooltip-Paste": "Coller",
            "Tooltip-SortBy": "Trier par",
            "Tooltip-Refresh": "Rafraîchir",
            "Tooltip-Selection": "Effacer la sélection",
            "Tooltip-View": "Vue",
            "Tooltip-Details": "Détails",
            "Tooltip-SelectAll": "Tout sélectionner",
            "Name": "Prénom",
            "Size": "Taille",
            "DateModified": "Modifié",
            "DateCreated": "Date créée",
            "Path": "Chemin",
            "Modified": "Modifié",
            "Created": "Créé",
            "Location": "Emplacement",
            "Type": "Type",
            "Permission": "Autorisation",
            "Ascending": "Ascendant",
            "Descending": "Descendant",
            "None": "Aucun",
            "View-LargeIcons": "Grandes icônes",
            "View-Details": "Détails",
            "Search": "Chercher",
            "Button-Ok": "D'ACCORD",
            "Button-Cancel": "Annuler",
            "Button-Yes": "Oui",
            "Button-No": "Non",
            "Button-Create": "Créer",
            "Button-Save": "Sauvegarder",
            "Header-NewFolder": "Dossier",
            "Content-NewFolder": "Entrez votre nom de dossier",
            "Header-Rename": "Renommer",
            "Content-Rename": "Entrez votre nouveau nom",
            "Header-Rename-Confirmation": "Renommer la confirmation",
            "Content-Rename-Confirmation": "Si vous modifiez une extension de nom de fichier, le fichier peut devenir instable. Voulez-vous vraiment le changer?",
            "Header-Delete": "Supprimer le fichier",
            "Content-Delete": "Êtes-vous sûr de vouloir supprimer ce fichier?",
            "Header-Multiple-Delete": "Supprimer plusieurs fichiers",
            "Content-Multiple-Delete": "Êtes-vous sûr de vouloir supprimer ces {0} fichiers?",
            "Header-Duplicate": "Fichier / Dossier existe",
            "Content-Duplicate": "{0} existe déjà. Voulez-vous renommer et coller?",
            "Header-Upload": "Télécharger des fichiers",
            "Error": "Erreur",
            "Validation-Empty": "Le nom du fichier ou du dossier ne peut être vide.",
            "Validation-Invalid": "Le nom du fichier ou du dossier {0} contient des caractères non valides. Veuillez utiliser un nom différent. Les noms de fichiers ou de dossiers valides ne peuvent pas se terminer par un point ou un espace, ni contenir aucun des caractères suivants: \\ /: *? \" < > | ",
            "Validation-NewFolder-Exists": "Un fichier ou un dossier portant le nom {0} existe déjà.",
            "Validation-Rename-Exists": "Impossible de renommer {0} en {1}: la destination existe déjà.",
            "Folder-Empty": "Ce dossier est vide",
            "File-Upload": "Faites glisser les fichiers ici pour les télécharger",
            "Search-Empty": "Aucun résultat trouvé",
            "Search-Key": "Essayez avec des mots clés différents",
            "Sub-Folder-Error": "Le dossier de destination est le sous-dossier du dossier source.",
            "Access-Denied": "Accès refusé",
            "Access-Details": "Vous n'avez pas la permission d'accéder à ce dossier.",
            "Header-Retry": "Le fichier existe déjà",
            "Content-Retry": "Un fichier avec ce nom existe déjà dans ce dossier. Que voudriez-vous faire?",
            "Button-Keep-Both": "Garde les deux",
            "Button-Replace": "Remplacer",
            "Button-Skip": "Sauter",
            "ApplyAll-Label": "Faites ceci pour tous les articles en cours",
			"Network-Error": "NetworkError: échec d'envoi sur XMLHTTPRequest: échec de chargement",
			"Server-Error": "ServerError: réponse non valide de"
        }
    },
    "ar": {
        "filemanager": {
            "NewFolder": "ملف جديد",
            "Upload": "رفع",
            "Delete": "حذف",
            "Rename": "إعادة تسمية",
            "Download": "تحميل",
            "Cut": "يقطع",
            "Copy": "نسخ",
            "Paste": "معجون",
            "SortBy": "ترتيب حسب",
            "Refresh": "تحديث",
            "Item-Selection": "العنصر المحدد",
            "Items-Selection": "العناصر المحددة",
            "View": "رأي",
            "Details": "تفاصيل",
            "SelectAll": "اختر الكل",
            "Open": "افتح",
            "Tooltip-NewFolder": "ملف جديد",
            "Tooltip-Upload": "رفع",
            "Tooltip-Delete": "حذف",
            "Tooltip-Rename": "إعادة تسمية",
            "Tooltip-Download": "تحميل",
            "Tooltip-Cut": "يقطع",
            "Tooltip-Copy": "نسخ",
            "Tooltip-Paste": "معجون",
            "Tooltip-SortBy": "ترتيب حسب",
            "Tooltip-Refresh": "تحديث",
            "Tooltip-Selection": "اختيار واضح",
            "Tooltip-View": "رأي",
            "Tooltip-Details": "تفاصيل",
            "Tooltip-SelectAll": "اختر الكل",
            "Name": "اسم",
            "Size": "بحجم",
            "DateModified": "تم التعديل",
            "DateCreated": "تاريخ الإنشاء",
            "Path": "مسار",
            "Modified": "تم التعديل",
            "Created": "خلقت",
            "Location": "موقعك",
            "Type": "نوع",
            "Permission": "الإذن",
            "Ascending": "تصاعدي",
            "Descending": "ترتيب تنازلي",
            "None": "لا شيء",
            "View-LargeIcons": "الرموز الكبيرة",
            "View-Details": "تفاصيل",
            "Search": "بحث",
            "Button-Ok": "حسنا",
            "Button-Cancel": "إلغاء",
            "Button-Yes": "نعم فعلا",
            "Button-No": "لا",
            "Button-Create": "خلق",
            "Button-Save": "حفظ",
            "Header-NewFolder": "مجلد",
            "Content-NewFolder": "أدخل اسم المجلد الخاص بك",
            "Header-Rename": "إعادة تسمية",
            "Content-Rename": "أدخل اسمك الجديد",
            "Header-Rename-Confirmation": "إعادة تسمية التأكيد",
            "Content-Rename-Confirmation": "إذا قمت بتغيير ملحق اسم الملف , فقد يصبح الملف غير مستقر. هل تريد بالتأكيد تغييره؟",
            "Header-Delete": "حذف ملف",
            "Content-Delete": "هل أنت متأكد أنك تريد حذف هذا الملف؟",
            "Header-Multiple-Delete": "حذف ملفات متعددة",
            "Content-Multiple-Delete": "هل أنت متأكد من أنك تريد حذف هذه الملفات {0}؟",
            "Header-Duplicate": "الملف / المجلد موجود",
            "Content-Duplicate": "{0} موجود بالفعل. هل تريد إعادة التسمية واللصق؟",
            "Header-Upload": "تحميل الملفات",
            "Error": "خطأ",
            "Validation-Empty": "لا يمكن أن يكون اسم الملف أو المجلد فارغًا.",
            "Validation-Invalid": "اسم الملف أو المجلد {0} يحتوي على أحرف غير صالحة. يرجى استخدام اسم مختلف. لا يمكن أن تنتهي أسماء الملفات أو المجلدات الصالحة بنقطة أو مسافة , ولا يمكن أن تحتوي على أي من الأحرف التالية: \\ /: *؟ \" < > | ",
            "Validation-NewFolder-Exists": "ملف أو مجلد يحمل الاسم {0} موجود بالفعل.",
            "Validation-Rename-Exists": "لا يمكن إعادة تسمية {0} إلى {1}: الوجهة موجودة بالفعل.",
            "Folder-Empty": "هذا المجلد فارغ",
            "File-Upload": "اسحب الملفات هنا للتحميل",
            "Search-Empty": "لا توجد نتائج",
            "Search-Key": "جرب بكلمات رئيسية مختلفة",
            "Sub-Folder-Error": "المجلد الوجهة هو المجلد الفرعي للمجلد المصدر.",
            "Access-Denied": "تم الرفض",
            "Access-Details": "ليس لديك إذن للوصول إلى هذا المجلد.",
            "Header-Retry": "الملف موجود بالفعل",
            "Content-Retry": "يوجد ملف بهذا الاسم بالفعل في هذا المجلد. ماذا تريد أن تفعل؟",
            "Button-Keep-Both": "احتفظ بكليهما",
            "Button-Replace": "يحل محل",
            "Button-Skip": "تخطى",
            "ApplyAll-Label": "القيام بذلك لجميع العناصر الحالية",
			"Network-Error": "NetworkError: فشل الإرسال على XMLHTTPRequest: فشل التحميل",
			"Server-Error": "ServerError: استجابة غير صالحة من"
        }
    },
    "zh": {
        "filemanager": {
            "NewFolder": "新建文件夹",
            "Upload": "上传",
            "Delete": "删除",
            "Rename": "改名",
            "Download": "下载",
            "Cut": "切",
            "Copy": "复制",
            "Paste": "糊",
            "SortBy": "排序方式",
            "Refresh": "刷新",
            "Item-Selection": "项目选择",
            "Items-Selection": "选中的项目",
            "View": "视图",
            "Details": "细节",
            "SelectAll": "全选",
            "Open": "打开",
            "Tooltip-NewFolder": "新建文件夹",
            "Tooltip-Upload": "上传",
            "Tooltip-Delete": "删除",
            "Tooltip-Rename": "改名",
            "Tooltip-Download": "下载",
            "Tooltip-Cut": "切",
            "Tooltip-Copy": "复制",
            "Tooltip-Paste": "糊",
            "Tooltip-SortBy": "排序方式",
            "Tooltip-Refresh": "刷新",
            "Tooltip-Selection": "清空选项",
            "Tooltip-View": "视图",
            "Tooltip-Details": "细节",
            "Tooltip-SelectAll": "全选",
            "Name": "名称",
            "Size": "尺寸",
            "DateModified": "改性",
            "DateCreated": "创建日期",
            "Path": "路径",
            "Modified": "改性",
            "Created": "创建",
            "Location": "地点",
            "Type": "类型",
            "Permission": "允许",
            "Ascending": "上升",
            "Descending": "降序",
            "None": "没有",
            "View-LargeIcons": "大图标",
            "View-Details": "细节",
            "Search": "搜索",
            "Button-Ok": "好",
            "Button-Cancel": "取消",
            "Button-Yes": "是",
            "Button-No": "没有",
            "Button-Create": "创建",
            "Button-Save": "保存",
            "Header-NewFolder": "夹",
            "Content-NewFolder": "输入您的文件夹名称",
            "Header-Rename": "改名",
            "Content-Rename": "输入你的新名字",
            "Header-Rename-Confirmation": "重命名确认",
            "Content-Rename-Confirmation": "如果更改文件扩展名,文件可能会变得不稳定。您确定要更改它吗？",
            "Header-Delete": "删除文件",
            "Content-Delete": "你确定要删除这个文件吗？",
            "Header-Multiple-Delete": "删除多个文件",
            "Content-Multiple-Delete": "您确定要删除这些{0}文件吗？",
            "Header-Duplicate": "文件/文件夹存在",
            "Content-Duplicate": "{0}已经存在。您要重命名和粘贴吗？",
            "Header-Upload": "上传文件",
            "Error": "错误",
            "Validation-Empty": "文件或文件夹名称不能为空。",
            "Validation-Invalid": "文件或文件夹名称{0}包含无效字符。请使用其他名称。有效文件或文件夹名称不能以点或空格结尾,并且不能包含以下任何字符：\\ /：*？\"< > |",
            "Validation-NewFolder-Exists": "名称为{0}的文件或文件夹已存在。",
            "Validation-Rename-Exists": "无法将{0}重命名为{1}：目标已存在。",
            "Folder-Empty": "这个文件夹是空的",
            "File-Upload": "将文件拖到此处上传",
            "Search-Empty": "未找到结果",
            "Search-Key": "尝试使用不同的关键字",
            "Sub-Folder-Error": "目标文件夹是源文件夹的子文件夹。",
            "Access-Denied": "拒绝访问",
            "Access-Details": "您无权访问此文件夹。",
            "Header-Retry": "文件已存在",
            "Content-Retry": "此文件夹中已存在具有此名称的文件。您想要做什么？",
            "Button-Keep-Both": "保留两个",
            "Button-Replace": "更换",
            "Button-Skip": "跳跃",
            "ApplyAll-Label": "为所有当前项目执行此操作",
			"Network-Error": "NetworkError：无法在XMLHTTP上发送请求：无法加载",
			"Server-Error": "ServerError：来自的无效响应"
        }
    }
})
// let hostUrl: string = 'https://ng2jq.syncfusion.com/ej2services/';
let hostUrl = 'http://localhost:62869/';
let feObj: FileManager = new FileManager({
    ajaxSettings: {
        url: hostUrl + 'api/FileManager/FileOperations',
        uploadUrl: hostUrl + 'api/FileManager/Upload',
        downloadUrl: hostUrl + 'api/FileManager/Download',
        getImageUrl: hostUrl + 'api/FileManager/GetImage'
    },
    locale: 'de'
});
feObj.appendTo('#file');