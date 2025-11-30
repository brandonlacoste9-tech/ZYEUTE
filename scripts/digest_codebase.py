import os

IGNORED_FOLDERS = {
    "node_modules", ".git", ".next", "dist", ".vscode",
    "marketplace", "gamification", "public", "assets"
}
IGNORED_FILES = {
    ".env", ".env.local", "package-lock.json", "yarn.lock"
}
ALLOWED_EXTENSIONS = {
    ".ts", ".tsx", ".js", ".jsx", ".json", ".py",
    ".md", ".prisma", ".css"
}
DIGEST_FILE = "_codebase_digest.txt"

def should_ignore_dir(dir_name):
    return dir_name in IGNORED_FOLDERS

def should_ignore_file(file_name):
    return file_name in IGNORED_FILES

def allowed_extension(file_name):
    return any(file_name.endswith(ext) for ext in ALLOWED_EXTENSIONS)

with open(DIGEST_FILE, "w", encoding="utf-8") as out_fp:
    for root, dirs, files in os.walk("."):
        dirs[:] = [d for d in dirs if not should_ignore_dir(d)]
        for file in files:
            if should_ignore_file(file):
                continue
            if not allowed_extension(file):
                continue
            rel_path = os.path.relpath(os.path.join(root, file), ".")
            out_fp.write(f"\n--- START FILE: {rel_path} ---\n")
            try:
                with open(os.path.join(root, file), "r", encoding="utf-8", errors="replace") as f:
                    out_fp.write(f.read())
            except Exception as e:
                out_fp.write(f"[Could not read file: {e}]\n")
            out_fp.write(f"\n--- END FILE: {rel_path} ---\n")

print(f"Codebase digest written to {DIGEST_FILE}")
