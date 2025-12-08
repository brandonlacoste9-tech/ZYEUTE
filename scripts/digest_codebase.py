import os

# CONFIGURATION
# ----------------
# The file where the digest will be saved
OUTPUT_FILE = "_codebase_digest.txt"

# Folders to completely ignore (The "Fat")
IGNORE_DIRS = {
    "node_modules", ".git", ".next", "dist", "build", ".vscode", ".idea",
    "marketplace", "gamification", # Explicitly ignoring cut features
    "public", "assets", "images",
    ".expo", "__pycache__", "venv", ".venv", "env", "coverage",
    "web-build", ".pnp"
}

# File extensions to specifically look for (The "Muscle")
INCLUDE_EXTS = {
    ".ts", ".tsx", ".js", ".jsx", ".json", ".py", ".md", ".css", ".prisma",
    ".sql"
}

# Specific files to ignore
IGNORE_FILES = {
    "package-lock.json", "yarn.lock", "pnpm-lock.yaml", 
    ".DS_Store", ".env", ".env.local", ".env.production", ".env.development"
    # Security: Never include env files
}

def digest_codebase():
    root_dir = os.getcwd() # Run from project root
    print(f"🚀 Starting codebase digest in: {root_dir}")
    
    with open(OUTPUT_FILE, "w", encoding="utf-8") as out_f:
        # Write Header
        out_f.write(f"COLONY OS CODEBASE DIGEST (LEAN HIVE)\n")
        out_f.write(f"=====================================\n\n")
        out_f.write(f"Generated for Gemini 1.5 Pro Context Window Analysis\n")
        out_f.write(f"Contains ONLY core engine code (Marketplace & Gamification removed)\n\n")
        
        file_count = 0
        
        for root, dirs, files in os.walk(root_dir):
            # Modify dirs in-place to skip ignored directories
            dirs[:] = [d for d in dirs if d not in IGNORE_DIRS]
            
            for file in files:
                if file in IGNORE_FILES:
                    continue
                    
                _, ext = os.path.splitext(file)
                if ext not in INCLUDE_EXTS:
                    continue
                
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, root_dir)
                
                try:
                    with open(file_path, "r", encoding="utf-8", errors="ignore") as in_f:
                        content = in_f.read()
                        
                    # Write File Context
                    out_f.write(f"--- START FILE: {rel_path} ---\n")
                    out_f.write(content)
                    out_f.write(f"\n--- END FILE: {rel_path} ---\n\n")
                    
                    print(f"✅ Processed: {rel_path}")
                    file_count += 1
                    
                except Exception as e:
                    print(f"❌ Error reading {rel_path}: {e}")

        print(f"\n✨ Digest Complete!")
        print(f"📄 Scanned {file_count} files.")
        print(f"💾 Output saved to: {OUTPUT_FILE}")
        print(f"\n🚀 Ready to load into Gemini 1.5 Pro!")

if __name__ == "__main__":
    digest_codebase()

