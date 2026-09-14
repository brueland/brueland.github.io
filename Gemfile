source "https://rubygems.org"

# This site has no Actions workflow, so GitHub Pages builds it with its own
# pinned Jekyll. Using the same gem locally keeps local output and the
# deployed site in step. `bundle update github-pages` pulls their latest.
gem "github-pages", group: :jekyll_plugins

# Ruby 3 dropped webrick from the standard library, and `jekyll serve` needs
# it to run the local server.
gem "webrick", "~> 1.8"

# Windows has no system tzdata, which Jekyll needs to handle post dates.
platforms :mingw, :x64_mingw, :mswin do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end
