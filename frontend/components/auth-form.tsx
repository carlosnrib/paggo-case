"use client";

import api from "@/services/api";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import React from "react";
import PropTypes from "prop-types";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = ({ onRegisterClick }: any) => {
  const { status } = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/platform");
    }
  }, [status, router]);

  const toggleVariant = useCallback(() => {
    setVariant(variant === "LOGIN" ? "REGISTER" : "LOGIN");
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      username: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      api
        .post("/auth/register", data)
        .then(() =>
          signIn("credentials", {
            ...data,
            redirect: false,
          })
        )
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid data!");
            console.log(callback)
          }

          if (callback?.ok) {
            toast.success("Registration successful!");
            router.push("/");
          }
        })
        .catch((error) => {
          console.log(error);
          if (error.response?.status === 500) {
            toast.error(
              "This username is already in use. Please choose another one."
            );
          } else {
            toast.error("Something went wrong!");
          }
        })
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          console.log(callback)
          if (callback?.error) {
            toast.error("Incorrect username or password !");
          }

          if (callback?.ok) {
            toast.success("Login successful!");
            router.push("/platform");
          }
        })
        .catch((error) => {
          toast.error("Algo deu errado!");
        })
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium leading-6"
                >
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    {...register("name")}
                    className="pl-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-[#939aa1] focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </>
          )}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium leading-6"
            >
              Username
            </label>
            <div className="mt-2">
              <input
                id="username"
                type="text"
                required
                placeholder="Enter your username"
                {...register("username")}
                className="pl-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-[#939aa1] focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                {...register("password")}
                className="pl-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-[#939aa1] focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              disabled={isLoading}
              type="submit"
              className="flex w-full justify-center rounded-md bg-[#939aa1] px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {variant === "LOGIN" ? "Login" : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"></div>
            <div className="relative flex justify-center text-sm"></div>
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-black">
          <div>
            {variant === "LOGIN"
              ? "First time?"
              : "Already has an account?"}
          </div>
          <button
            type="button"
            onClick={() => {
              toggleVariant();
              onRegisterClick(variant);
            }}
            className="underline cursor-pointer"
          >
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

AuthForm.propTypes = {
  onRegisterClick: PropTypes.func.isRequired,
};

export default AuthForm;
