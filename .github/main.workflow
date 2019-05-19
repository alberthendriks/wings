workflow "Publish" {
  on = "push"
  resolves = [
    "Lerna Publish",
    "Build",
  ]
}

action "Install" {
  uses = "docker://node"
  runs = "npx"
  args = "yarn --frozen-lockfile"
}

action "Build" {
  uses = "docker://node"
  needs = ["Install"]
  runs = "npx"
  args = "lerna run --ignore @wingscms/gatsby-starter-hummingbird build"
}

action "Test" {
  uses = "docker://node"
  needs = ["Build"]
  runs = "npx"
  args = "lerna run test"
}

action "Master" {
  needs = "Test"
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Lerna Publish" {
  uses = "docker://node"
  needs = ["Master"]
  runs = "npx"
  args = "lerna publish from-package"
  secrets = ["NPM_TOKEN"]
}
