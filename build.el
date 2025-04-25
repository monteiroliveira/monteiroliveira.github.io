(require 'ox-publish)
(require 'ob-tangle)

(require 'package)
(setq package-user-dir (expand-file-name "./.packages"))
(setq package-archives '(("melpa" . "https://melpa.org/packages/")
                         ("elpa" . "https://elpa.gnu.org/packages/")))
(package-initialize)
(unless package-archive-contents
  (package-refresh-contents))

(package-install 'htmlize)
(setq org-html-html5-fancy nil
      org-html-htmlize-output-type 'css)

(setq org-confirm-babel-evaluate nil
      org-export-babel-evaluate t
      org-export-use-babel t)

(setq org-publish-project-alist
      (list
       (list "monteiroliveira"
             :recursive t
             :base-directory "./content"
             :publishing-directory "./public"
             :publishing-function 'org-html-publish-to-html
             :with-author nil
             :with-toc t)))
(setq org-html-postamble nil)

(org-babel-do-load-languages
 'org-babel-load-languages
 '((emacs-lisp . t)))

(org-publish-all t)
(message "build complete")
