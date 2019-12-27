pipeline {
   agent any

stages {

    stage("SonarQube analysis") {
            steps {
              withSonarQubeEnv('SonarQubeServer') { 
                bat "${scannerHome}/bin/sonar-scanner"
              }
            }
          }
          
    stage('Install package') {
      steps {
		 bat "npm install"
      }
    }

	stage('Run UnitTest') {
      steps {
		 bat "npm run test"
      }
    }
 
    stage('Deployment Step Dev') {
      when {
        anyOf {
          branch 'develop';
          equals expected: 'dev', actual: params.GIT_BRANCH
        }
      }
      steps {
        bat "\"${GCLOUD}\" config set account develop@anywheretogo.com"
         bat "\"${GCLOUD}\" compute --project \"claimdi360\" ssh --zone \"asia-southeast1-b\" \"develop@meclaim360-dev\" --command=\"sh deployScript.sh\""
      }
    } 
 
    stage('Deployment Step Staging') {
      when {
        anyOf {
          branch 'staging';
          equals expected: 'staging', actual: params.GIT_BRANCH
        }
      }
      steps {
          bat "\"${GCLOUD}\" config set account develop@anywheretogo.com"
         bat "\"${GCLOUD}\" compute --project \"claimdi360\" ssh --zone \"asia-southeast1-b\" \"develop@meclaim360-dev\" --command=\"sh deployScript.sh\""
      }
    }

    stage('Deployment Step Production') {
      when {
        anyOf {
          branch 'master';
          equals expected: 'master', actual: params.GIT_BRANCH
        }
      }
      steps {
          bat "\"${GCLOUD}\" config set account develop@anywheretogo.com"
         bat "\"${GCLOUD}\" compute --project \"claimdi360\" ssh --zone \"asia-southeast1-b\" \"develop@meclaim360-dev\" --command=\"sh deployScript.sh\""
      }
    }

 } 

 environment {
    GCLOUD = "C:\\Program Files (x86)\\Google\\Cloud SDK\\google-cloud-sdk\\bin\\gcloud.cmd"
  }
} 