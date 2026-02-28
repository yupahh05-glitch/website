import os
import glob
import sys

# Dry-run by default. Use --apply to write files.
apply_changes = '--apply' in sys.argv

folder = r"c:\Users\Mostafa\OneDrive\Attachments\School website"
os.chdir(folder)

# Find all main HTML files (exclude copies and system files)
html_files = [f for f in glob.glob("*.html") if f != "index.html" and "Copy" not in f and "header" not in f and "navbar" not in f and "original" not in f and "simple" not in f and "stem-egypt" not in f]

# CSS to add (Harvard style navbar)
new_navbar_css = '''        /* ============ HARVARD STYLE HAMBURGER NAVIGATION ============ */
        
        .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 70px;
            background: #0b1f3a;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 40px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }
        
        .navbar-brand {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 20px;
            font-weight: 600;
            color: #ffffff;
            text-decoration: none;
            letter-spacing: 0.02em;
            transition: opacity 0.3s ease;
        }
        
        .navbar-brand:hover {
            opacity: 0.85;
        }
        
        /* Hamburger Icon */
        .hamburger {
            background: none;
            border: none;
            cursor: pointer;
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 8px;
            transition: all 0.3s ease;
            z-index: 1001;
        }
        
        .hamburger span {
            width: 28px;
            height: 3px;
            background: #ffffff;
            border-radius: 2px;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hamburger.active span:nth-child(1) {
            transform: translateY(14px) rotate(45deg);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: translateY(-14px) rotate(-45deg);
        }
        
        /* Side Menu */
        .sidebar-menu {
            position: fixed;
            left: -300px;
            top: 0;
            width: 280px;
            height: 100vh;
            background: #0b1f3a;
            z-index: 999;
            transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
            padding: 100px 40px 60px;
        }
        
        .sidebar-menu.active {
            left: 0;
        }
        
        .menu-links {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        
        .menu-links li {
            margin: 0;
        }
        
        .menu-links a {
            display: block;
            font-family: 'Inter', sans-serif;
            font-size: 18px;
            font-weight: 400;
            color: #ffffff;
            text-decoration: none;
            padding: 16px 0;
            padding-left: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.3s ease;
            position: relative;
        }
        
        .menu-links a:hover {
            background: rgba(255, 255, 255, 0.08);
            padding-left: 12px;
        }
        
        /* Menu Overlay */
        .menu-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.4);
            z-index: 998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .menu-overlay.active {
            opacity: 1;
            visibility: visible;
        }
        
        body {
            padding-top: 70px;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
            .navbar {
                padding: 0 30px;
            }
            .navbar-brand {
                font-size: 18px;
            }
            .sidebar-menu {
                width: 260px;
                padding: 90px 30px 60px;
            }
        }
        
        @media (max-width: 480px) {
            .navbar {
                padding: 0 20px;
            }
            .navbar-brand {
                font-size: 16px;
            }
            .sidebar-menu {
                width: 240px;
                padding: 80px 20px 40px;
            }
            .menu-links a {
                font-size: 16px;
                padding: 14px 0;
            }
        }
        '''

# New navbar HTML
new_navbar_html = '''    <!-- HARVARD STYLE HAMBURGER NAVIGATION -->
    <nav class="navbar">
        <a href="index.html" class="navbar-brand">STEM School – Behera</a>
        <button class="hamburger" id="hamburger" aria-label="Toggle menu">
            <span></span>
            <span></span>
            <span></span>
        </button>
    </nav>

    <!-- Side Menu -->
    <div class="sidebar-menu" id="sidebarMenu">
        <ul class="menu-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="about.html">About</a></li>
            <li><a href="circullum2/index.html">Programs</a></li>
            <li><a href="admissions.html">Admissions</a></li>
            <li><a href="extracurricular.html">Campus</a></li>
            <li><a href="extracurricular.html">Extracurricular</a></li>
            <li><a href="media.html">Media</a></li>
            <li><a href="index.html#contact">Contact</a></li>
        </ul>
    </div>

    <!-- Menu Overlay -->
    <div class="menu-overlay" id="menuOverlay"></div>
    <!-- END NAVIGATION -->'''

# JavaScript
new_navbar_js = '''    <script>
        // Hamburger Menu Toggle
        const hamburger = document.getElementById('hamburger');
        const sidebarMenu = document.getElementById('sidebarMenu');
        const menuOverlay = document.getElementById('menuOverlay');

        if (hamburger && sidebarMenu && menuOverlay) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                sidebarMenu.classList.toggle('active');
                menuOverlay.classList.toggle('active');
                document.body.style.overflow = sidebarMenu.classList.contains('active') ? 'hidden' : '';
            });

            menuOverlay.addEventListener('click', () => {
                hamburger.classList.remove('active');
                sidebarMenu.classList.remove('active');
                menuOverlay.classList.remove('active');
                document.body.style.overflow = '';
            });

            // Close menu when clicking a link
            document.querySelectorAll('.sidebar-menu a').forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    sidebarMenu.classList.remove('active');
                    menuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            });

            // Close menu on ESC key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && sidebarMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    sidebarMenu.classList.remove('active');
                    menuOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
    </script>'''

updated_files = []

for html_file in html_files[:15]:  # Update first 15 files
    try:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Find and remove old navbar CSS section
        # This pattern looks for the .top-nav CSS block
        import re
        content = re.sub(
            r'\/\* Fixed Top Navigation \*\/.*?@media \(max-width: 480px\).*?}.*?}\s*<\/style>',
            '',
            content,
            flags=re.DOTALL,
            count=1
        )
        
        # Remove old HTML navbar
        content = re.sub(
            r'<!-- ?Top Navigation Bar ?-->.*?<!-- ?GLOBAL NAVBAR END ?-->',
            new_navbar_html,
            content,
            flags=re.DOTALL,
            count=1
        )
        
        # Remove old hamburger CSS styles if present
        content = re.sub(
            r'\/\*.*?NAVIGATION.*?\*\/.*?\.sidebar-menu.*?\.dropdown-toggle\.active.*?}',
            '',
            content,
            flags=re.DOTALL
        )
        
        # Ensure new CSS is in the head
        if '.navbar {' not in content and '<style>' in content:
            # Add new CSS after the first <style> opening
            head_idx = content.find('</head>')
            if head_idx != -1:
                # Check if we need to add it
                if 'HARVARD STYLE HAMBURGER' not in content:
                    style_to_add = f'    <style>\n{new_navbar_css}\n    </style>\n    '
                    content = content[:head_idx] + style_to_add + content[head_idx:]
        
        # Ensure JavaScript is before </body>
        if 'const hamburger = document.getElementById' not in content:
            body_idx = content.rfind('</body>')
            if body_idx != -1:
                content = content[:body_idx] + '\n' + new_navbar_js + '\n    ' + content[body_idx:]
        
        # Write if changed
        if content != original_content:
            if apply_changes:
                with open(html_file, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"✓ {html_file}")
            else:
                print(f"Dry-run: would update {html_file}")
            updated_files.append(html_file)
    except Exception as e:
        print(f"✗ {html_file}: {str(e)[:50]}")

print(f"\nFiles changed (or would change): {len(updated_files)} / {len(html_files)}")
print("Files:", updated_files)
if not apply_changes:
    print("Run with --apply to write changes to disk.")
