import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDir = path.join(process.cwd(), "content/posts");
const microblogDir = path.join(process.cwd(), "content/microblog");

let errors = 0;

function validatePosts() {
    if (!fs.existsSync(postsDir)) {
        console.log("⚠️  No posts directory found");
        return;
    }

    const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    files.forEach((file) => {
        const raw = fs.readFileSync(path.join(postsDir, file), "utf-8");
        const { data } = matter(raw);

        if (!data.title) {
            console.error(`❌ ${file}: missing title`);
            errors++;
        }
        if (!data.createdAt) {
            console.error(`❌ ${file}: missing createdAt`);
            errors++;
        }
        if (data.createdAt && isNaN(new Date(data.createdAt).getTime())) {
            console.error(`❌ ${file}: invalid createdAt date`);
            errors++;
        }
        if (!data.category) {
            console.warn(`⚠️  ${file}: missing category`);
        }
        if (!data.description) {
            console.warn(`⚠️  ${file}: missing description (affects SEO)`);
        }
    });

    console.log(`\n📝 Posts: ${files.length} files checked`);
}

function validateMicroblog() {
    if (!fs.existsSync(microblogDir)) {
        console.log("⚠️  No microblog directory found");
        return;
    }

    const files = fs.readdirSync(microblogDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

    files.forEach((file) => {
        const raw = fs.readFileSync(path.join(microblogDir, file), "utf-8");
        const { data } = matter(raw);

        if (!data.title) {
            console.error(`❌ microblog/${file}: missing title`);
            errors++;
        }
        if (!data.createdAt) {
            console.error(`❌ microblog/${file}: missing createdAt`);
            errors++;
        }
    });

    console.log(`📓 Microblog: ${files.length} files checked`);
}

console.log("🔍 Validating content...\n");
validatePosts();
validateMicroblog();

if (errors > 0) {
    console.error(`\n💥 ${errors} error(s) found!`);
    process.exit(1);
} else {
    console.log("\n✅ All content is valid!");
}