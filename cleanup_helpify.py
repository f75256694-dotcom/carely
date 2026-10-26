import os
import shutil

# Definiere den Hauptpfad (aktueller Ordner)
PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))
BACKUP_DIR = os.path.join(PROJECT_ROOT, "_old_cleanup_backup")

# Was soll bereinigt werden?
# 1. Alte PDFs (z.B. im Root oder public-Ordner)
# 2. Unnötige System- / Cache-Ordner die nicht gebraucht werden
TARGET_EXTENSIONS = ('.pdf',)
IGNORED_DIRS = {'.git', 'node_modules', '.next', '__pycache__', 'venv', '_old_cleanup_backup', 'src/Agents'}

def run_cleanup():
    print("🧹 Starte Helpify Workspace Cleanup...")
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    moved_files_count = 0

    for root, dirs, files in os.walk(PROJECT_ROOT, topdown=True):
        # Ignorierte Ordner aus dem Suchpfad ausschließen
        dirs[:] = [d for d in dirs if d not in IGNORED_DIRS and not d.startswith('_')]
        
        for file in files:
            file_path = os.path.join(root, file)
            rel_path = os.path.relpath(file_path, PROJECT_ROOT)
            
            # Prüfen, ob es eine zu eliminierende PDF oder eine temporäre Datei ist
            if file.lower().endswith(TARGET_EXTENSIONS):
                target_backup_path = os.path.join(BACKUP_DIR, rel_path)
                os.makedirs(os.path.dirname(target_backup_path), exist_ok=True)
                
                # Verschiebe die Datei ins Backup, anstatt sie hart zu löschen
                shutil.move(file_path, target_backup_path)
                print(f"📦 Veraltete Datei verschoben: {rel_path} -> _old_cleanup_backup/")
                moved_files_count += 1

    print(f"\n✅ Cleanup abgeschlossen! {moved_files_count} veraltete Dateien wurden sicher ins Backup verschoben.")
    print(f"📁 Der Backup-Ordner liegt unter: {BACKUP_DIR}")

if __name__ == "__main__":
    run_cleanup()