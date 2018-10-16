module Gitlab
  module Ci
    module Status
      module Deployment
        class Manual < Status::Extended
          def environment_text
            "Please trigger the build to deploy to %{environmentLink}."
          end

          def self.matches?(deployment, user)
            deployment.manual?
          end
        end
      end
    end
  end
end